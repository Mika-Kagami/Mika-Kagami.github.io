create table if not exists public.guestbook_avatars (
  id text primary key,
  label text not null,
  image_path text not null,
  sort_order integer not null unique
);

insert into public.guestbook_avatars (id, label, image_path, sort_order)
values
  ('profile', 'Profile avatar', 'assets/profile.png', 0),
  ('profile1', 'Profile avatar 1', 'assets/profile1.png', 1),
  ('profile2', 'Profile avatar 2', 'assets/profile2.png', 2),
  ('profile3', 'Profile avatar 3', 'assets/profile3.png', 3),
  ('profile4', 'Profile avatar 4', 'assets/profile4.png', 4),
  ('profile5', 'Profile avatar 5', 'assets/profile5.png', 5),
  ('profile6', 'Profile avatar 6', 'assets/profile6.png', 6),
  ('profile7', 'Profile avatar 7', 'assets/profile7.png', 7)
on conflict (id) do update
set
  label = excluded.label,
  image_path = excluded.image_path,
  sort_order = excluded.sort_order;

alter table public.guestbook
  add column if not exists avatar text;

update public.guestbook
set avatar = 'profile'
where avatar is null
   or not exists (
    select 1
    from public.guestbook_avatars
    where guestbook_avatars.id = guestbook.avatar
  );

alter table public.guestbook
  alter column avatar set default 'profile',
  alter column avatar set not null;

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'guestbook_avatar_allowed'
      and conrelid = 'public.guestbook'::regclass
  ) then
    alter table public.guestbook
      drop constraint guestbook_avatar_allowed;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'guestbook_avatar_fkey'
      and conrelid = 'public.guestbook'::regclass
  ) then
    alter table public.guestbook
      add constraint guestbook_avatar_fkey
      foreign key (avatar)
      references public.guestbook_avatars(id)
      on update cascade
      on delete restrict;
  end if;
end $$;
