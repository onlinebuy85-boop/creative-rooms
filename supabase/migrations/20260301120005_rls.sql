-- Row Level Security

alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.room_members enable row level security;
alter table public.hooks enable row level security;
alter table public.hook_seats enable row level security;
alter table public.messages enable row level security;

-- Profiles
create policy "profiles_select_all"
  on public.profiles for select
  to anon, authenticated
  using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Rooms
create policy "rooms_select_active"
  on public.rooms for select
  to anon, authenticated
  using (is_active = true);

create policy "rooms_insert_authenticated"
  on public.rooms for insert
  to authenticated
  with check (
    owner_id in (select id from public.profiles where user_id = auth.uid())
  );

create policy "rooms_update_owner"
  on public.rooms for update
  to authenticated
  using (
    owner_id in (select id from public.profiles where user_id = auth.uid())
  );

-- Room members
create policy "room_members_select"
  on public.room_members for select
  to anon, authenticated
  using (true);

create policy "room_members_insert_self"
  on public.room_members for insert
  to authenticated
  with check (
    profile_id in (select id from public.profiles where user_id = auth.uid())
  );

-- Hooks
create policy "hooks_select_active"
  on public.hooks for select
  to anon, authenticated
  using (is_active = true);

create policy "hooks_insert_creator"
  on public.hooks for insert
  to authenticated
  with check (
    creator_id in (select id from public.profiles where user_id = auth.uid())
  );

create policy "hooks_update_creator"
  on public.hooks for update
  to authenticated
  using (
    creator_id in (select id from public.profiles where user_id = auth.uid())
  );

-- Hook seats
create policy "hook_seats_select"
  on public.hook_seats for select
  to anon, authenticated
  using (true);

create policy "hook_seats_insert_self"
  on public.hook_seats for insert
  to authenticated
  with check (
    profile_id in (select id from public.profiles where user_id = auth.uid())
  );

-- Messages
create policy "messages_select_room"
  on public.messages for select
  to authenticated
  using (true);

create policy "messages_insert_member"
  on public.messages for insert
  to authenticated
  with check (
    profile_id in (select id from public.profiles where user_id = auth.uid())
  );

-- Storage: avatars
create policy "avatars_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'avatars');

create policy "avatars_auth_upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_auth_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_auth_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage: hooks (private audio)
create policy "hooks_auth_read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'hooks');

create policy "hooks_auth_upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'hooks'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage: room-images
create policy "room_images_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'room-images');

create policy "room_images_auth_upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'room-images');
