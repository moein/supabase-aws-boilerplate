DROP POLICY "user_profiles.allow_select_by_owner" ON public.user_profiles;
DROP POLICY "user_profiles.allow_insert_by_owner" ON public.user_profiles;
DROP TRIGGER IF EXISTS handle_auth_user_update ON auth.users;
DROP FUNCTION handle_auth_user_update;
DROP TABLE public.user_profiles;
