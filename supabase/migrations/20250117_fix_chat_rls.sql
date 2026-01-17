-- ============================================
-- CREATE TABLES (if they don't exist)
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Create indexes (IF NOT EXISTS not supported for indexes, so we use a different approach)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_chat_conversations_session_id') THEN
    CREATE INDEX idx_chat_conversations_session_id ON chat_conversations(session_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_chat_conversations_status') THEN
    CREATE INDEX idx_chat_conversations_status ON chat_conversations(status);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_chat_conversations_started_at') THEN
    CREATE INDEX idx_chat_conversations_started_at ON chat_conversations(started_at);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_chat_messages_conversation_id') THEN
    CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_chat_messages_created_at') THEN
    CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
  END IF;
END$$;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at (drop first to avoid duplicate)
DROP TRIGGER IF EXISTS update_chat_conversations_updated_at ON chat_conversations;
CREATE TRIGGER update_chat_conversations_updated_at
BEFORE UPDATE ON chat_conversations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ENABLE RLS
-- ============================================
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DROP OLD POLICIES (if they exist)
-- ============================================
DROP POLICY IF EXISTS "Chat conversations are viewable by authenticated users" ON chat_conversations;
DROP POLICY IF EXISTS "Anyone can create chat conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Authenticated users can update chat conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Chat messages are viewable by authenticated users" ON chat_messages;
DROP POLICY IF EXISTS "Anyone can create chat messages" ON chat_messages;
DROP POLICY IF EXISTS "chat_conversations_insert" ON chat_conversations;
DROP POLICY IF EXISTS "chat_conversations_select" ON chat_conversations;
DROP POLICY IF EXISTS "chat_conversations_update" ON chat_conversations;
DROP POLICY IF EXISTS "chat_conversations_delete" ON chat_conversations;
DROP POLICY IF EXISTS "chat_messages_insert" ON chat_messages;
DROP POLICY IF EXISTS "chat_messages_select" ON chat_messages;
DROP POLICY IF EXISTS "chat_messages_delete" ON chat_messages;

-- ============================================
-- CHAT CONVERSATIONS POLICIES
-- ============================================

-- Anyone can create a conversation
CREATE POLICY "chat_conversations_insert" 
  ON chat_conversations FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Anonymous users can view their own conversations (by session_id passed in request)
-- Authenticated users (admin) can view all conversations
CREATE POLICY "chat_conversations_select" 
  ON chat_conversations FOR SELECT 
  TO anon, authenticated
  USING (
    -- Authenticated users can see all
    auth.role() = 'authenticated' 
    OR 
    -- Anonymous users can see their own (session_id matches)
    session_id = coalesce(
      current_setting('request.headers', true)::json->>'x-session-id',
      ''
    )
  );

-- Anonymous users can update their own conversations (to save visitor info)
-- Authenticated users can update all
CREATE POLICY "chat_conversations_update" 
  ON chat_conversations FOR UPDATE 
  TO anon, authenticated
  USING (
    auth.role() = 'authenticated' 
    OR 
    session_id = coalesce(
      current_setting('request.headers', true)::json->>'x-session-id',
      ''
    )
  )
  WITH CHECK (
    auth.role() = 'authenticated' 
    OR 
    session_id = coalesce(
      current_setting('request.headers', true)::json->>'x-session-id',
      ''
    )
  );

-- Only authenticated users can delete conversations
CREATE POLICY "chat_conversations_delete" 
  ON chat_conversations FOR DELETE 
  TO authenticated
  USING (true);

-- ============================================
-- CHAT MESSAGES POLICIES
-- ============================================

-- Anyone can create messages (for their conversation)
CREATE POLICY "chat_messages_insert" 
  ON chat_messages FOR INSERT 
  TO anon, authenticated
  WITH CHECK (
    -- Must be for a conversation they own or admin
    EXISTS (
      SELECT 1 FROM chat_conversations 
      WHERE id = conversation_id 
      AND (
        auth.role() = 'authenticated'
        OR session_id = coalesce(
          current_setting('request.headers', true)::json->>'x-session-id',
          ''
        )
      )
    )
  );

-- Anonymous users can view messages from their own conversations
-- Authenticated users can view all
CREATE POLICY "chat_messages_select" 
  ON chat_messages FOR SELECT 
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_conversations 
      WHERE id = conversation_id 
      AND (
        auth.role() = 'authenticated'
        OR session_id = coalesce(
          current_setting('request.headers', true)::json->>'x-session-id',
          ''
        )
      )
    )
  );

-- Only authenticated users can delete messages
CREATE POLICY "chat_messages_delete" 
  ON chat_messages FOR DELETE 
  TO authenticated
  USING (true);
