-- Mikael's Vin — Supabase schema for the quiz backend
--
-- Run this SQL in your Supabase project's SQL Editor to set up the quizzes table
-- used by the live multi-player quiz feature.
--
-- After running, copy your project's URL and anon public key into the
-- SUPABASE_URL and SUPABASE_ANON_KEY constants near the top of index.html.

-- Quizzes table: one row per quiz (active, ended, or archived)
create table if not exists quizzes (
  id text primary key,
  code text unique not null,
  title text not null,
  status text not null default 'waiting',         -- waiting | active | ended
  current_question int not null default -1,
  questions jsonb not null default '[]'::jsonb,
  participants jsonb not null default '[]'::jsonb,
  answers jsonb not null default '{}'::jsonb,
  master_id text not null,
  master_name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indices for efficient lookups
create index if not exists quizzes_code_idx on quizzes(code);
create index if not exists quizzes_status_idx on quizzes(status);

-- Enable realtime push notifications on this table (required for live quiz sync)
alter publication supabase_realtime add table quizzes;

-- Row-level security: open access for anon clients.
-- This is appropriate for a casual, trusted-friends quiz app.
-- For stricter access, replace these policies with ones that check an auth.uid().
alter table quizzes enable row level security;

create policy "Anyone can read quizzes"
  on quizzes for select using (true);

create policy "Anyone can insert quizzes"
  on quizzes for insert with check (true);

create policy "Anyone can update quizzes"
  on quizzes for update using (true);

create policy "Anyone can delete quizzes"
  on quizzes for delete using (true);
