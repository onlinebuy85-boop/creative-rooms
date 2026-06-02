-- Rooms + members (aligns with lib/db/src/schema/rooms.ts, roomMembers.ts)

create table if not exists public.rooms (
  id serial primary key,
  name text not null,
  description text,
  vibe text,
  genres text[] not null default '{}',
  max_members integer not null default 4,
  owner_id integer not null references public.profiles (id) on delete restrict,
  is_active boolean not null default true,
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rooms_owner_id_idx on public.rooms (owner_id);
create index if not exists rooms_is_active_idx on public.rooms (is_active);

drop trigger if exists rooms_updated_at on public.rooms;
create trigger rooms_updated_at
  before update on public.rooms
  for each row execute function public.set_profiles_updated_at();

create table if not exists public.room_members (
  id serial primary key,
  room_id integer not null references public.rooms (id) on delete cascade,
  profile_id integer not null references public.profiles (id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  unique (room_id, profile_id)
);

create index if not exists room_members_room_id_idx on public.room_members (room_id);
create index if not exists room_members_profile_id_idx on public.room_members (profile_id);

-- Enriched room row for list UIs (member count + owner display name)
create or replace view public.rooms_with_stats as
select
  r.id,
  r.name,
  r.description,
  r.vibe,
  r.genres,
  r.max_members,
  r.owner_id,
  p.display_name as owner_name,
  r.is_active,
  r.cover_image_url,
  r.created_at,
  r.updated_at,
  coalesce(m.member_count, 0)::integer as member_count
from public.rooms r
join public.profiles p on p.id = r.owner_id
left join (
  select room_id, count(*)::integer as member_count
  from public.room_members
  group by room_id
) m on m.room_id = r.id;

grant select on public.rooms_with_stats to anon, authenticated;
