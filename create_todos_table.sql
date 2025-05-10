-- Create the todos table
create table if not exists public.todos (
    id uuid default gen_random_uuid() primary key,
    user_id uuid,
    task text not null,
    is_complete boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.todos enable row level security;

-- Create a policy that allows all operations for now
-- You can make this more restrictive later when adding authentication
create policy "Allow public access to todos"
    on public.todos
    for all
    using (true)
    with check (true);

-- Enable realtime subscriptions on the todos table
alter publication supabase_realtime add table public.todos; 