-- Triggerfunksjonen skal ikke kunne kalles via API-et
revoke execute on function public.handle_new_user() from anon, authenticated, public;
