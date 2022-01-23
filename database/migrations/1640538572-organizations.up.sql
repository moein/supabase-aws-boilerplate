CREATE TABLE public.organizations (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL PRIMARY KEY,
    name character varying NOT NULL CONSTRAINT name_length CHECK (char_length(name) >= 3),
    owner_id uuid DEFAULT auth.uid() NOT NULL UNIQUE REFERENCES public.user_profiles(id),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "organizations.allow_read_by_owner" ON public.organizations FOR SELECT USING ((auth.uid() = owner_id));
CREATE POLICY "organizations.allow_insert_by_owner" ON public.organizations FOR INSERT WITH CHECK ((auth.uid() = owner_id));
CREATE POLICY "organizations.allow_delete_by_owner" ON public.organizations FOR DELETE USING ((auth.uid() = owner_id));