-- Room chat messages (aligns with lib/db/src/schema/messages.ts)

create table if not exists public.messages (
  id serial primary key,
  room_id integer not null references public.rooms (id) on delete cascade,
  profile_id integer not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_room_id_idx on public.messages (room_id);
create index if not exists messages_created_at_idx on public.messages (room_id, created_at desc);

create or replace view public.messages_with_sender as
select
  m.id,
  m.room_id,
  m.profile_id,
  p.display_name as sender_name,
  p.avatar_url as sender_avatar_url,
  m.content,
  m.created_at
from public.messages m
join public.profiles p on p.id = m.profile_id;

grant select on public.messages_with_sender to anon, authenticated;
