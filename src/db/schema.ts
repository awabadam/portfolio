import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export * from './auth-schema';

// Field names mirror the column names (snake_case) so rows keep the same
// shape the app used with Supabase.

const timestamps = {
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  live_url: text('live_url'),
  behance_url: text('behance_url'),
  thumbnail_url: text('thumbnail_url'),
  iframe_blocked: boolean('iframe_blocked').default(false),
  github_url: text('github_url'),
  technologies: text('technologies').array(),
  results: text('results').array(),
  featured: boolean('featured').default(false),
  role: text('role'),
  overview: text('overview'),
  objectives: text('objectives').array(),
  approach: text('approach').array(),
  design_concept: text('design_concept'),
  final_thoughts: text('final_thoughts'),
  images: text('images').array(),
  user_id: text('user_id'),
  ...timestamps,
});

export const blogCategories = pgTable('blog_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  ...timestamps,
});

export const blogPosts = pgTable(
  'blog_posts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    // Translations share a slug; uniqueness is per locale.
    slug: text('slug').notNull(),
    excerpt: text('excerpt').notNull(),
    content: text('content').notNull(),
    featured_image_url: text('featured_image_url'),
    category: text('category').notNull(),
    tags: text('tags').array(),
    author_id: text('author_id'),
    published: boolean('published').default(false),
    published_at: timestamp('published_at', { withTimezone: true }),
    meta_title: text('meta_title'),
    meta_description: text('meta_description'),
    reading_time: integer('reading_time').default(5),
    view_count: integer('view_count').default(0),
    locale: text('locale').default('en'),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('blog_posts_slug_locale_unique').on(t.slug, t.locale),
    index('idx_blog_posts_published').on(t.published),
    index('idx_blog_posts_category').on(t.category),
    index('idx_blog_posts_published_at').on(t.published_at),
  ]
);

export const leads = pgTable(
  'leads',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    source: text('source').notNull(),
    name: text('name'),
    email: text('email'),
    phone: text('phone'),
    message: text('message'),
    project_type: text('project_type'),
    status: text('status').default('new'),
    notes: text('notes'),
    ip_address: text('ip_address'),
    user_agent: text('user_agent'),
    metadata: jsonb('metadata'),
    ...timestamps,
  },
  (t) => [
    index('idx_leads_source').on(t.source),
    index('idx_leads_status').on(t.status),
    index('idx_leads_email').on(t.email),
    index('idx_leads_created_at').on(t.created_at),
    check(
      'leads_status_check',
      sql`${t.status} in ('new', 'contacted', 'qualified', 'converted', 'lost')`
    ),
  ]
);

export const chatConversations = pgTable(
  'chat_conversations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    session_id: text('session_id').notNull(),
    visitor_name: text('visitor_name'),
    visitor_email: text('visitor_email'),
    visitor_phone: text('visitor_phone'),
    ip_address: text('ip_address'),
    user_agent: text('user_agent'),
    started_at: timestamp('started_at', { withTimezone: true }).defaultNow(),
    ended_at: timestamp('ended_at', { withTimezone: true }),
    status: text('status').default('active'),
    ...timestamps,
  },
  (t) => [
    index('idx_chat_conversations_session_id').on(t.session_id),
    index('idx_chat_conversations_status').on(t.status),
  ]
);

export const chatMessages = pgTable(
  'chat_messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    conversation_id: uuid('conversation_id').references(() => chatConversations.id, {
      onDelete: 'cascade',
    }),
    role: text('role').notNull(),
    content: text('content').notNull(),
    metadata: jsonb('metadata'),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [
    index('idx_chat_messages_conversation_id').on(t.conversation_id),
    check('chat_messages_role_check', sql`${t.role} in ('user', 'assistant', 'system')`),
  ]
);

export type Project = typeof projects.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type BlogCategory = typeof blogCategories.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type ChatConversation = typeof chatConversations.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
