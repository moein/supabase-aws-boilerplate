CREATE TABLE public.organization_invitations (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL PRIMARY KEY,
    email character varying NOT NULL,
    role member_role NOT NULL,
    expires_at timestamp without time zone DEFAULT NOW() + INTERVAL '1 DAY' CHECK (expires_at > now()),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    inviter_id uuid DEFAULT auth.uid() REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    accepted_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);
CREATE INDEX organization_invitations_email_index ON public.organization_invitations USING btree(email);

ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "organization_invitations.allow_select_by_manager" ON public.organization_invitations FOR SELECT USING (public.member_can_do(organization_id, 'manage_members'));
CREATE POLICY "organization_invitations.allow_insert_by_manager" ON public.organization_invitations FOR INSERT WITH CHECK (public.member_can_do(organization_id, 'manage_members') AND inviter_id = auth.uid());
CREATE POLICY "organization_invitations.allow_delete_by_manager" ON public.organization_invitations FOR DELETE USING (public.member_can_do(organization_id, 'manage_members'));

CREATE FUNCTION public.validate_invitation() RETURNS trigger
    LANGUAGE plpgsql
AS
$$
BEGIN
    IF EXISTS (SELECT i.id FROM public.organization_invitations i WHERE i.organization_id = NEW.organization_id AND email = NEW.email AND expires_at > now())
    THEN
        RAISE EXCEPTION 'invitation_already_exists';
    END IF;
    -- @todo Allow managers to see the profile of user
--     IF EXISTS (SELECT m.id FROM public.organization_members m JOIN public.user_profiles p ON p.id = m.user_id WHERE m.organization_id = NEW.organization_id AND p.email = NEW.email)
--     THEN
--         RAISE EXCEPTION 'user_already_member';
--     END IF;
    RETURN NEW;
END;
$$;
CREATE TRIGGER validate_invitation
    BEFORE INSERT
    ON public.organization_invitations
    FOR EACH ROW
EXECUTE FUNCTION public.validate_invitation();

CREATE FUNCTION public.handle_new_invitation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
    user_id uuid;
BEGIN
    SELECT u.id INTO user_id FROM public.user_profiles u WHERE u.email = NEW.email;
    IF user_id IS NOT NULL
    THEN
        INSERT INTO public.organization_members (organization_id, user_id, role, inviter_id) VALUES (NEW.organization_id, user_id, NEW.role, NEW.inviter_id);
        UPDATE public.organization_invitations SET accepted_at = now() WHERE id = NEW.id;
    END IF;
    RETURN new;
END;
$$;
CREATE TRIGGER handle_new_invitation
    AFTER INSERT
    ON public.organization_invitations
    FOR EACH ROW
EXECUTE FUNCTION public.handle_new_invitation();


CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  invitation RECORD;
BEGIN
  INSERT INTO public.user_profiles (id) VALUES (NEW.id);
  FOR invitation IN
          SELECT * FROM public.organization_invitations WHERE email = NEW.email AND expires_at > now()
      LOOP
          INSERT INTO public.organization_members (user_id, organization_id, role, inviter_id) VALUES (new.id, invitation.organization_id, invitation.role, invitation.inviter_id);
          UPDATE public.organization_invitations SET accepted_at = now() WHERE id = invitation.id;
      END LOOP;
  INSERT INTO public.organizations (owner_id, name) VALUES(new.id, new.email);
  RETURN new;
END;
$$;
CREATE TRIGGER handle_new_user
    AFTER INSERT
    ON auth.users
    FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER aws_organization_invitations_insert
    AFTER INSERT
    ON public.organization_invitations
    FOR EACH ROW
EXECUTE FUNCTION supabase_functions.http_request(
        'WEBHOOK_URL', 'POST',
        '{"Content-type":"application/json","Authorization":"Token WEBHOOK_SECRET","Event":"organization_invitations.insert"}', '{}', '1000');