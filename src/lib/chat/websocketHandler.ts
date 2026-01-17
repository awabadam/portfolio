import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { createAnonClientWithSession } from '@/lib/supabase/server-app';
import { ChatContext, ChatMessage, generateSessionId } from './chatBot';
import { getOpenRouterResponse } from './openRouter';

interface WebSocketMessage {
  type: 'message' | 'ping' | 'pong' | 'init';
  data?: any;
  message?: string;
  sessionId?: string;
  conversationId?: string;
}

interface ClientConnection {
  ws: WebSocket;
  sessionId: string;
  conversationId?: string;
  context: ChatContext;
  lastPing: number;
  ipAddress?: string;
  userAgent?: string;
}

const connections = new Map<string, ClientConnection>();

// Cleanup inactive connections (30 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, conn] of Array.from(connections.entries())) {
    if (now - conn.lastPing > 30 * 60 * 1000) {
      conn.ws.close();
      connections.delete(sessionId);
    }
  }
}, 5 * 60 * 1000); // Check every 5 minutes

export function handleWebSocketConnection(ws: WebSocket, req: IncomingMessage) {
  let sessionId: string | null = null;
  let conversationId: string | null = null;

  // Extract session ID from query params or create new one
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  sessionId = url.searchParams.get('sessionId') || generateSessionId();
  conversationId = url.searchParams.get('conversationId') || null;

  // Initialize context
  let context: ChatContext = {
    conversationHistory: [],
    visitorName: undefined,
    visitorEmail: undefined,
    visitorPhone: undefined,
  };

  // Load conversation history if conversationId exists
  if (conversationId) {
    loadConversationHistory(conversationId, sessionId).then((history) => {
      if (history) {
        context = history;
        const conn = connections.get(sessionId);
        if (conn) {
          conn.context = context;
          conn.conversationId = conversationId;
        }
      }
    }).catch(console.error);
  }

  // Extract IP and user agent
  const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                    (req.headers['x-real-ip'] as string) || 
                    'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  // Store connection
  const connection: ClientConnection = {
    ws,
    sessionId,
    conversationId: conversationId || undefined,
    context,
    lastPing: Date.now(),
    ipAddress,
    userAgent,
  };
  connections.set(sessionId, connection);

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'init',
    data: {
      sessionId,
      conversationId,
      message: {
        role: 'assistant',
        content: "Hello! I'm here to help you learn about Awab's web design services. How can I assist you today?",
      },
    },
  }));

  // Handle incoming messages
  ws.on('message', async (data: Buffer) => {
    try {
      const message: WebSocketMessage = JSON.parse(data.toString());
      connection.lastPing = Date.now();

      if (message.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
        return;
      }

      if (message.type === 'message' && message.message) {
        await handleChatMessage(connection, message.message);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        data: { error: 'Failed to process message' },
      }));
    }
  });

  // Handle connection close
  ws.on('close', () => {
    if (sessionId) {
      connections.delete(sessionId);
    }
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    if (sessionId) {
      connections.delete(sessionId);
    }
  });

  // Send ping every 30 seconds to keep connection alive
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
      connection.lastPing = Date.now();
    } else {
      clearInterval(pingInterval);
    }
  }, 30000);
}

async function loadConversationHistory(conversationId: string, sessionId: string): Promise<ChatContext | null> {
  try {
    const supabase = createAnonClientWithSession(sessionId);
    const { data: conversation } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (!conversation) return null;

    const { data: messages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    return {
      conversationHistory:
        messages?.map((msg) => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content,
          metadata: msg.metadata,
        })) || [],
      visitorName: conversation.visitor_name,
      visitorEmail: conversation.visitor_email,
      visitorPhone: conversation.visitor_phone,
    };
  } catch (error) {
    console.error('Error loading conversation history:', error);
    return null;
  }
}

async function handleChatMessage(connection: ClientConnection, userMessage: string) {
  const { ws, sessionId, conversationId, context } = connection;

  // Send typing indicator
  ws.send(JSON.stringify({
    type: 'typing',
    data: { typing: true },
  }));

  try {
    // Extract contact information from user message if present
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const phoneRegex = /(\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;

    const emailMatch = userMessage.match(emailRegex);
    const phoneMatch = userMessage.match(phoneRegex);

    let updatedContext: ChatContext = { ...context };

    // Handle contact collection
    if (context.isCollectingInfo) {
      if (context.isCollectingInfo.type === 'name' && !emailMatch && !phoneMatch) {
        updatedContext.visitorName = userMessage.trim();
        updatedContext.isCollectingInfo = { type: 'email' };
      } else if (context.isCollectingInfo.type === 'email' && emailMatch) {
        updatedContext.visitorEmail = emailMatch[0];
        updatedContext.isCollectingInfo = { type: 'phone' };
      } else if (context.isCollectingInfo.type === 'phone') {
        if (phoneMatch) {
          updatedContext.visitorPhone = phoneMatch[0];
        }
        if (updatedContext.visitorEmail || updatedContext.visitorPhone) {
          updatedContext.isCollectingInfo = undefined;
        }
      }
    }

    // Get or create conversation
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      currentConversationId = await createConversation(sessionId, connection.ipAddress, connection.userAgent);
      connection.conversationId = currentConversationId;
    }

    // Get AI response
    let response: string;
    let action: string | undefined;
    const hasOpenRouterKey = !!process.env.OPENROUTER_KEY;

    if (hasOpenRouterKey) {
      try {
        response = await getOpenRouterResponse(userMessage, updatedContext);
        updatedContext.conversationHistory = [
          ...updatedContext.conversationHistory,
          { role: 'user', content: userMessage },
          { role: 'assistant', content: response },
        ];
        if (updatedContext.visitorEmail && !action && !updatedContext.isCollectingInfo) {
          action = 'contact_collected';
        }
      } catch (error) {
        console.error('OpenRouter error:', error);
        // Fallback to rule-based
        const { processMessage } = require('./chatBot');
        const result = processMessage(userMessage, updatedContext);
        response = result.response;
        updatedContext = result.context;
        action = result.action;
      }
    } else {
      const { processMessage } = require('./chatBot');
      const result = processMessage(userMessage, updatedContext);
      response = result.response;
      updatedContext = result.context;
      action = result.action;
    }

    // Update connection context
    connection.context = updatedContext;

    // Save to database
    await saveMessages(currentConversationId, userMessage, response, action, updatedContext, sessionId);

    // Send response
    ws.send(JSON.stringify({
      type: 'typing',
      data: { typing: false },
    }));

    ws.send(JSON.stringify({
      type: 'message',
      data: {
        role: 'assistant',
        content: response,
        metadata: action ? { action } : null,
        conversationId: currentConversationId,
      },
    }));
  } catch (error) {
    console.error('Error processing chat message:', error);
    ws.send(JSON.stringify({
      type: 'typing',
      data: { typing: false },
    }));
    ws.send(JSON.stringify({
      type: 'message',
      data: {
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again or contact us directly.",
      },
    }));
  }
}

async function createConversation(sessionId: string, ipAddress: string = 'unknown', userAgent: string = 'WebSocket Client'): Promise<string> {
  try {
    const supabase = createAnonClientWithSession(sessionId);

    const { data, error } = await supabase
      .from('chat_conversations')
      .insert({
        session_id: sessionId,
        ip_address: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
        user_agent: userAgent,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error creating conversation:', error);
    return '';
  }
}

async function saveMessages(
  conversationId: string,
  userMessage: string,
  response: string,
  action: string | undefined,
  context: ChatContext,
  sessionId: string
) {
  try {
    const supabase = createAnonClientWithSession(sessionId);

    // Save user message
    const { error: userMsgError } = await supabase.from('chat_messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content: userMessage,
    });

    if (userMsgError) {
      console.error('Error saving user message:', userMsgError);
    }

    // Save assistant response
    const { error: assistantMsgError } = await supabase.from('chat_messages').insert({
      conversation_id: conversationId,
      role: 'assistant',
      content: response,
      metadata: action ? { action } : null,
    });

    if (assistantMsgError) {
      console.error('Error saving assistant message:', assistantMsgError);
    }

    // Update conversation with visitor info
    if (context.visitorName || context.visitorEmail || context.visitorPhone) {
      const updateData: Record<string, string> = {};
      if (context.visitorName) updateData.visitor_name = context.visitorName;
      if (context.visitorEmail) updateData.visitor_email = context.visitorEmail;
      if (context.visitorPhone) updateData.visitor_phone = context.visitorPhone;

      const { error: updateError } = await supabase
        .from('chat_conversations')
        .update(updateData)
        .eq('id', conversationId);

      if (updateError) {
        console.error('Error updating conversation:', updateError);
      }
    }
  } catch (error) {
    console.error('Error saving messages:', error);
  }
}
