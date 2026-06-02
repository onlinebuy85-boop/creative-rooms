-- Hooks (aligns with lib/db/src/schema/hooks.ts)

create table if not exists public.hooks (
  id serial primary key,
  creator_id integer not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  audio_url text not null,
  vibe text,
  tags text[] not null default '{}',
  looking_for text[] not null default '{}',
  max_seats integer not null default 3,
  room_id integer references public.rooms (id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists hooks_creator_id_idx on public.hooks (creator_id);
create index if not exists hooks_room_id_idx on public.hooks (room_id);
create index if not exists hooks_is_active_idx on public.hooks (is_active);

create table if not exists public.hook_seats (
  id serial primary key,
  hook_id integer not null references public.hooks (id) on delete cascade,
  profile_id integer not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (hook_id, profile_id)
);

create or replace view public.hooks_with_creator as
select
  h.*,
  p.display_name as creator_name,
  p.avatar_url as creator_avatar_url,
  greatest(h.max_seats - coalesce(s.taken, 0), 0)::integer as seats_left
from public.hooks h
join public.profiles p on p.id = h.creator_id
left join (
  select hook_id, count(*)::integer as taken
  from public.hook_seats
  group by hook_id
) s on s.hook_id = h.id;

grant select on public.hooks_with_creator to anon, authenticated;
