# Krathong Config + Admin add-on

## Files
- `config/config.js`: shared browser-safe Supabase config. Public publishable key only.
- `admin/`: login and dashboard for listing/deleting krathongs.
- `database/admin-setup.sql`: SQL to create admin membership and deletion policy.

## Install
1. Copy `config/` and `admin/` folders into your existing repository root.
2. In the existing main page, load config before your app script: `<script src="config/config.js"></script>`.
3. In your main `app.js`, replace hard-coded URL/key with:
   `const SUPABASE_URL = window.KRATHONG_CONFIG.SUPABASE_URL;`
   `const SUPABASE_ANON_KEY = window.KRATHONG_CONFIG.SUPABASE_PUBLISHABLE_KEY;`
   Avoid declaring `supabase` if that identifier already exists; use `supabaseClient`.
4. Run `database/admin-setup.sql` in Supabase SQL Editor.
5. Create the admin login via Supabase Authentication (Email/Password). Then add that account's UUID to `public.krathong_admins` from the SQL editor, e.g. `insert into public.krathong_admins(user_id) values ('YOUR-USER-UUID');`.
6. Visit `/krathong/admin/` (or the site's corresponding admin folder path).

Do not put a service-role or secret key in any frontend file. The membership table and RLS policy control admin delete privileges.
