CREATE DOMAIN member_role AS smallint CHECK(VALUE >= 1 AND VALUE <= 3);

CREATE TABLE public.organization_members (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    organization_id uuid NOT NULL REFERENCES public.organizations(id)  ON DELETE CASCADE,
    role member_role NOT NULL,
    inviter_id uuid DEFAULT auth.uid() REFERENCES user_profiles(id) ON DELETE SET NULL, -- We set this default null since when the inviter's user is deleted we don't want this member to be deleted
    created_at timestamp without time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX organization_members_member_ukey
    ON public.organization_members(organization_id, user_id);

CREATE VIEW my_organizations AS
    SELECT o.*
    FROM organizations o
    LEFT JOIN organization_members m ON m.organization_id = o.id
    WHERE o.owner_id = auth.uid() OR m.user_id = auth.uid();

CREATE VIEW my_memberships AS
    SELECT m.*
    FROM organization_members m
    JOIN organizations o ON m.organization_id = o.id
    WHERE o.owner_id = auth.uid() OR m.user_id = auth.uid();

CREATE FUNCTION public.member_has_role(org_id uuid, min_role int) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
RETURN EXISTS (SELECT m.organization_id FROM public.my_memberships m WHERE m.organization_id = org_id AND m.role >= min_role);
END;$$;

CREATE FUNCTION public.member_can_do(org_id uuid, action_code varchar) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
min_role int;
BEGIN
SELECT CASE action_code
           WHEN 'manage_members' THEN 3
           WHEN 'access_org' THEN 1
           END r INTO min_role;
RETURN public.member_has_role(org_id, min_role);
END;$$;

ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "organization_members.allow_insert_by_managers" ON public.organization_members FOR UPDATE USING (public.member_can_do(organization_id, 'manage_members'));
CREATE POLICY "organization_members.allow_update_by_managers" ON public.organization_members FOR UPDATE USING (public.member_can_do(organization_id, 'manage_members'));
CREATE POLICY "organization_members.allow_delete_by_managers" ON public.organization_members FOR DELETE USING (public.member_can_do(organization_id, 'manage_members'));

CREATE FUNCTION public.handle_new_organization() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.organization_members (user_id, organization_id, role) VALUES(new.owner_id, new.id, 3);
  RETURN new;
END;
$$;
CREATE TRIGGER handle_new_organization
    AFTER INSERT
    ON public.organizations
    FOR EACH ROW
EXECUTE FUNCTION public.handle_new_organization();