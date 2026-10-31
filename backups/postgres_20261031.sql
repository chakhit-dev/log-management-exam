--
-- PostgreSQL database dump
--

\restrict vNiHR4peFf97mEkUcdh65u22GPFWdJctKg55wfAeX2zIo1jaWGwfolEl201urYi

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: admin
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO admin;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: admin
--

COMMENT ON SCHEMA public IS '';


--
-- Name: system_role; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.system_role AS ENUM (
    'SuperAdmin',
    'User'
);


ALTER TYPE public.system_role OWNER TO admin;

--
-- Name: tenant_role; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.tenant_role AS ENUM (
    'TenantAdmin',
    'Viewer'
);


ALTER TYPE public.tenant_role OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO admin;

--
-- Name: tenant_memberships; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.tenant_memberships (
    tenant_id integer NOT NULL,
    user_id integer NOT NULL,
    role public.tenant_role DEFAULT 'Viewer'::public.tenant_role NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tenant_memberships OWNER TO admin;

--
-- Name: tenants; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.tenants (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ip_address text
);


ALTER TABLE public.tenants OWNER TO admin;

--
-- Name: tenants_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.tenants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tenants_id_seq OWNER TO admin;

--
-- Name: tenants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.tenants_id_seq OWNED BY public.tenants.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    system_role public.system_role DEFAULT 'User'::public.system_role NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: tenants id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tenants ALTER COLUMN id SET DEFAULT nextval('public.tenants_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
4cfbbe48-a027-481e-ab46-01ebea7397de	871ce043f8fcc854b819fa75185e912f343de5d32c35e1b5fd4ed4a4c0ee317b	2026-10-27 11:20:40.422452+00	20261023095844_init	\N	\N	2026-10-27 11:20:40.403657+00	1
d9b069a4-0126-407d-af74-5ed4ff497570	e626cc683676616aed444e6717aab38001ebe7f377d70ec15f1dd561fdd35483	2026-10-27 11:20:40.425959+00	20261024175657_init	\N	\N	2026-10-27 11:20:40.423115+00	1
9bd17f96-ff98-4a5a-91a2-8c50d81ac692	16c153e93837f9f32510c344ad7eb1597e9216e75e33226f84f9c83823c9ea25	2026-10-27 11:20:40.427791+00	20261024175841_init	\N	\N	2026-10-27 11:20:40.426456+00	1
d7e3f0e9-669b-48b1-897c-932c51335a80	f1f8026bddc3ca3f7cd9ca848f344a15863ebe9a8c60cd63b3df569f33a63c50	2026-10-27 11:20:40.441675+00	20261027111532_init	\N	\N	2026-10-27 11:20:40.428287+00	1
\.


--
-- Data for Name: tenant_memberships; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.tenant_memberships (tenant_id, user_id, role, created_at) FROM stdin;
1	1	TenantAdmin	2026-10-27 11:24:28.437428+00
1	2	Viewer	2026-10-30 22:22:18.778+00
1	3	Viewer	2026-10-30 22:30:32.865+00
2	1	TenantAdmin	2026-10-30 23:15:40.874796+00
2	2	Viewer	2026-10-30 23:16:05.285+00
3	3	TenantAdmin	2026-10-30 23:18:30.267762+00
3	1	Viewer	2026-10-30 23:34:16.417+00
\.


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.tenants (id, name, created_at, ip_address) FROM stdin;
1	demoA	2026-10-27 11:22:44.669+00	\N
2	demoB	2026-10-27 11:22:49.247+00	\N
3	demoC	2026-10-27 11:22:53.199+00	\N
4	demoD	2026-10-27 11:22:59.503+00	\N
5	demoE	2026-10-27 11:23:05.11+00	\N
6	demoF	2026-10-27 11:23:11.012+00	\N
7	demoG	2026-10-27 11:23:16.791+00	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (id, username, email, password_hash, system_role, created_at) FROM stdin;
1	t1	t1@gg.com	$2b$12$GzUUKdCkR2.tezVQ4lS1Vut/R4DCE/8pS28UNmwn74.5/UIngVOKW	User	2026-10-27 11:21:58.14+00
2	t2	t2@gg.com	$2b$12$wx9DDBffJvMW7H8o7FN8muCKBn2AmGeYSQW.Ly3v.l6g2I3Q/md9C	User	2026-10-27 11:22:32.54+00
3	t3	t3@gg.com	$2b$12$AH80JfNr1uEZVcHHyKrRxeNq6UYQagea2En457/iwX.0VNFiwT./G	SuperAdmin	2026-10-30 22:28:17.537+00
\.


--
-- Name: tenants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.tenants_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: tenant_memberships tenant_memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tenant_memberships
    ADD CONSTRAINT tenant_memberships_pkey PRIMARY KEY (tenant_id, user_id);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: tenant_memberships tenant_memberships_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tenant_memberships
    ADD CONSTRAINT tenant_memberships_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tenant_memberships tenant_memberships_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tenant_memberships
    ADD CONSTRAINT tenant_memberships_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: admin
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict vNiHR4peFf97mEkUcdh65u22GPFWdJctKg55wfAeX2zIo1jaWGwfolEl201urYi

