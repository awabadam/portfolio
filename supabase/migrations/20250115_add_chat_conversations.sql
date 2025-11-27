-- Chat Conversations Table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  visitor_name TEXT,
  visitor_email TEXT,
  visitor_phone TEXT,
  ip_address TEXT,
  user_agent TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_conversations_session_id ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_status ON chat_conversations(status);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_started_at ON chat_conversations(started_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Enable RLS
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_conversations
CREATE POLICY "Chat conversations are viewable by authenticated users" 
  ON chat_conversations FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Anyone can create chat conversations" 
  ON chat_conversations FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update chat conversations" 
  ON chat_conversations FOR UPDATE 
  TO authenticated 
  USING (true);

-- RLS Policies for chat_messages
CREATE POLICY "Chat messages are viewable by authenticated users" 
  ON chat_messages FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Anyone can create chat messages" 
  ON chat_messages FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_chat_conversations_updated_at
BEFORE UPDATE ON chat_conversations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

