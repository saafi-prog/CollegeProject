--
-- PostgreSQL database dump
--

\restrict DopURJHKZjfSubuRtUz5fXZqUrKsqs98mTfaar1MaXo1nB0tl11IM9RblNS4Vpa

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-08-23 17:43:29

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 228 (class 1255 OID 19959)
-- Name: update_timestamp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_timestamp() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 19874)
-- Name: classes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.classes (
    id integer NOT NULL,
    niveau_nom character varying(100) NOT NULL,
    professeur_principal_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.classes OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 19873)
-- Name: classes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.classes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.classes_id_seq OWNER TO postgres;

--
-- TOC entry 4932 (class 0 OID 0)
-- Dependencies: 219
-- Name: classes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.classes_id_seq OWNED BY public.classes.id;


--
-- TOC entry 224 (class 1259 OID 19899)
-- Name: eleves; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.eleves (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    genre character varying(10) NOT NULL,
    classe_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT eleves_genre_check CHECK (((genre)::text = ANY ((ARRAY['M'::character varying, 'F'::character varying])::text[])))
);


ALTER TABLE public.eleves OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 19898)
-- Name: eleves_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.eleves_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.eleves_id_seq OWNER TO postgres;

--
-- TOC entry 4933 (class 0 OID 0)
-- Dependencies: 223
-- Name: eleves_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.eleves_id_seq OWNED BY public.eleves.id;


--
-- TOC entry 222 (class 1259 OID 19888)
-- Name: matieres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.matieres (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.matieres OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 19887)
-- Name: matieres_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.matieres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.matieres_id_seq OWNER TO postgres;

--
-- TOC entry 4934 (class 0 OID 0)
-- Dependencies: 221
-- Name: matieres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.matieres_id_seq OWNED BY public.matieres.id;


--
-- TOC entry 227 (class 1259 OID 19930)
-- Name: notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notes (
    id integer NOT NULL,
    notevalue numeric(4,2) NOT NULL,
    eleve_id integer NOT NULL,
    matiere_id integer NOT NULL,
    professeur_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT notes_notevalue_check CHECK (((notevalue >= (0)::numeric) AND (notevalue <= (20)::numeric)))
);


ALTER TABLE public.notes OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 19929)
-- Name: notes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notes_id_seq OWNER TO postgres;

--
-- TOC entry 4935 (class 0 OID 0)
-- Dependencies: 226
-- Name: notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notes_id_seq OWNED BY public.notes.id;


--
-- TOC entry 225 (class 1259 OID 19913)
-- Name: professeur_matieres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.professeur_matieres (
    professeur_id integer NOT NULL,
    matiere_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.professeur_matieres OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 19864)
-- Name: professeurs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.professeurs (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    genre character varying(10) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT professeurs_genre_check CHECK (((genre)::text = ANY ((ARRAY['M'::character varying, 'F'::character varying])::text[])))
);


ALTER TABLE public.professeurs OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 19863)
-- Name: professeurs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.professeurs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.professeurs_id_seq OWNER TO postgres;

--
-- TOC entry 4936 (class 0 OID 0)
-- Dependencies: 217
-- Name: professeurs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.professeurs_id_seq OWNED BY public.professeurs.id;


--
-- TOC entry 4723 (class 2604 OID 19877)
-- Name: classes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes ALTER COLUMN id SET DEFAULT nextval('public.classes_id_seq'::regclass);


--
-- TOC entry 4729 (class 2604 OID 19902)
-- Name: eleves id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eleves ALTER COLUMN id SET DEFAULT nextval('public.eleves_id_seq'::regclass);


--
-- TOC entry 4726 (class 2604 OID 19891)
-- Name: matieres id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matieres ALTER COLUMN id SET DEFAULT nextval('public.matieres_id_seq'::regclass);


--
-- TOC entry 4733 (class 2604 OID 19933)
-- Name: notes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);


--
-- TOC entry 4720 (class 2604 OID 19867)
-- Name: professeurs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professeurs ALTER COLUMN id SET DEFAULT nextval('public.professeurs_id_seq'::regclass);


--
-- TOC entry 4919 (class 0 OID 19874)
-- Dependencies: 220
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.classes (id, niveau_nom, professeur_principal_id, created_at, updated_at) FROM stdin;
2	Sixième	5	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
3	Cinquième	6	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
4	Quatrième	7	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
5	Troisième	8	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
\.


--
-- TOC entry 4923 (class 0 OID 19899)
-- Dependencies: 224
-- Data for Name: eleves; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eleves (id, nom, prenom, genre, classe_id, created_at, updated_at) FROM stdin;
1	Lemaire	Leon	M	2	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
2	Lefebvre	Lea	F	2	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
4	LeBoeuf	Lisa	F	3	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
5	Sabin	Ilias	M	4	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
6	Legros	Rose	F	4	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
7	Dupont	Marc	M	5	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
8	Bamba	Celine	F	5	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
3	Boujar	Hugo	M	2	2025-08-21 01:43:10.025186	2025-08-21 19:55:58.806619
12	Test	Test	F	5	2025-08-22 23:35:54.983629	2025-08-23 15:42:44.552689
\.


--
-- TOC entry 4921 (class 0 OID 19888)
-- Dependencies: 222
-- Data for Name: matieres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.matieres (id, nom, created_at, updated_at) FROM stdin;
8	Mathématiques	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
9	Français	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
10	Histoire-Géographie	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
11	Physiques-Chimie	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
12	SVT	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
13	Anglais	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
14	Espagnol	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
\.


--
-- TOC entry 4926 (class 0 OID 19930)
-- Dependencies: 227
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notes (id, notevalue, eleve_id, matiere_id, professeur_id, created_at, updated_at) FROM stdin;
5	16.00	6	11	5	2025-08-22 20:32:07.857079	2025-08-22 20:32:07.857079
6	18.50	8	10	6	2025-08-22 20:38:17.497717	2025-08-22 20:38:17.497717
7	15.50	7	13	7	2025-08-22 21:25:16.991176	2025-08-22 21:25:16.991176
8	13.00	12	12	8	2025-08-22 21:48:48.662042	2025-08-22 21:48:48.662042
3	19.00	1	8	5	2025-08-21 03:56:18.630153	2025-08-23 00:23:48.845286
9	13.00	12	8	5	2025-08-23 17:45:28.723245	2025-08-23 15:47:15.299947
10	14.00	4	9	6	2025-08-23 16:14:06.840446	2025-08-23 16:14:06.840446
\.


--
-- TOC entry 4924 (class 0 OID 19913)
-- Dependencies: 225
-- Data for Name: professeur_matieres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.professeur_matieres (professeur_id, matiere_id, created_at) FROM stdin;
5	8	2025-08-20 23:43:10.025186
5	11	2025-08-20 23:43:10.025186
6	9	2025-08-20 23:43:10.025186
6	10	2025-08-20 23:43:10.025186
7	13	2025-08-20 23:43:10.025186
7	14	2025-08-20 23:43:10.025186
8	12	2025-08-22 21:46:21.708074
\.


--
-- TOC entry 4917 (class 0 OID 19864)
-- Dependencies: 218
-- Data for Name: professeurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.professeurs (id, nom, prenom, genre, created_at, updated_at) FROM stdin;
5	Dubois	Marie	F	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
6	Martin	Pierre	M	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
7	Bernard	Sophie	F	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
8	Dupont	Jean	M	2025-08-20 23:43:10.025186	2025-08-20 23:43:10.025186
\.


--
-- TOC entry 4937 (class 0 OID 0)
-- Dependencies: 219
-- Name: classes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.classes_id_seq', 5, true);


--
-- TOC entry 4938 (class 0 OID 0)
-- Dependencies: 223
-- Name: eleves_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.eleves_id_seq', 12, true);


--
-- TOC entry 4939 (class 0 OID 0)
-- Dependencies: 221
-- Name: matieres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.matieres_id_seq', 14, true);


--
-- TOC entry 4940 (class 0 OID 0)
-- Dependencies: 226
-- Name: notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notes_id_seq', 10, true);


--
-- TOC entry 4941 (class 0 OID 0)
-- Dependencies: 217
-- Name: professeurs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.professeurs_id_seq', 8, true);


--
-- TOC entry 4742 (class 2606 OID 19881)
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);


--
-- TOC entry 4748 (class 2606 OID 19907)
-- Name: eleves eleves_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eleves
    ADD CONSTRAINT eleves_pkey PRIMARY KEY (id);


--
-- TOC entry 4744 (class 2606 OID 19897)
-- Name: matieres matieres_nom_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matieres
    ADD CONSTRAINT matieres_nom_key UNIQUE (nom);


--
-- TOC entry 4746 (class 2606 OID 19895)
-- Name: matieres matieres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matieres
    ADD CONSTRAINT matieres_pkey PRIMARY KEY (id);


--
-- TOC entry 4756 (class 2606 OID 19938)
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- TOC entry 4752 (class 2606 OID 19918)
-- Name: professeur_matieres professeur_matieres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professeur_matieres
    ADD CONSTRAINT professeur_matieres_pkey PRIMARY KEY (professeur_id, matiere_id);


--
-- TOC entry 4740 (class 2606 OID 19872)
-- Name: professeurs professeurs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professeurs
    ADD CONSTRAINT professeurs_pkey PRIMARY KEY (id);


--
-- TOC entry 4749 (class 1259 OID 19966)
-- Name: idx_eleves_classe; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_eleves_classe ON public.eleves USING btree (classe_id);


--
-- TOC entry 4753 (class 1259 OID 19967)
-- Name: idx_notes_eleve; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notes_eleve ON public.notes USING btree (eleve_id);


--
-- TOC entry 4754 (class 1259 OID 19968)
-- Name: idx_notes_matiere; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notes_matiere ON public.notes USING btree (matiere_id);


--
-- TOC entry 4750 (class 1259 OID 19969)
-- Name: idx_professeur_matieres_professeur; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_professeur_matieres_professeur ON public.professeur_matieres USING btree (professeur_id);


--
-- TOC entry 4766 (class 2620 OID 19961)
-- Name: classes trg_update_classes; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_classes BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 4768 (class 2620 OID 19963)
-- Name: eleves trg_update_eleves; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_eleves BEFORE UPDATE ON public.eleves FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 4767 (class 2620 OID 19962)
-- Name: matieres trg_update_matieres; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_matieres BEFORE UPDATE ON public.matieres FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 4770 (class 2620 OID 19965)
-- Name: notes trg_update_notes; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_notes BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 4769 (class 2620 OID 19964)
-- Name: professeur_matieres trg_update_professeur_matieres; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_professeur_matieres BEFORE UPDATE ON public.professeur_matieres FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 4765 (class 2620 OID 19960)
-- Name: professeurs trg_update_professeurs; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_professeurs BEFORE UPDATE ON public.professeurs FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 4757 (class 2606 OID 19882)
-- Name: classes classes_professeur_principal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_professeur_principal_id_fkey FOREIGN KEY (professeur_principal_id) REFERENCES public.professeurs(id);


--
-- TOC entry 4758 (class 2606 OID 19908)
-- Name: eleves eleves_classe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eleves
    ADD CONSTRAINT eleves_classe_id_fkey FOREIGN KEY (classe_id) REFERENCES public.classes(id) ON DELETE CASCADE;


--
-- TOC entry 4761 (class 2606 OID 19954)
-- Name: notes fk_prof_matiere; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT fk_prof_matiere FOREIGN KEY (professeur_id, matiere_id) REFERENCES public.professeur_matieres(professeur_id, matiere_id);


--
-- TOC entry 4762 (class 2606 OID 19939)
-- Name: notes notes_eleve_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_eleve_id_fkey FOREIGN KEY (eleve_id) REFERENCES public.eleves(id) ON DELETE CASCADE;


--
-- TOC entry 4763 (class 2606 OID 19944)
-- Name: notes notes_matiere_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_matiere_id_fkey FOREIGN KEY (matiere_id) REFERENCES public.matieres(id) ON DELETE CASCADE;


--
-- TOC entry 4764 (class 2606 OID 19949)
-- Name: notes notes_professeur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_professeur_id_fkey FOREIGN KEY (professeur_id) REFERENCES public.professeurs(id) ON DELETE CASCADE;


--
-- TOC entry 4759 (class 2606 OID 19924)
-- Name: professeur_matieres professeur_matieres_matiere_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professeur_matieres
    ADD CONSTRAINT professeur_matieres_matiere_id_fkey FOREIGN KEY (matiere_id) REFERENCES public.matieres(id) ON DELETE CASCADE;


--
-- TOC entry 4760 (class 2606 OID 19919)
-- Name: professeur_matieres professeur_matieres_professeur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professeur_matieres
    ADD CONSTRAINT professeur_matieres_professeur_id_fkey FOREIGN KEY (professeur_id) REFERENCES public.professeurs(id) ON DELETE CASCADE;


-- Completed on 2025-08-23 17:43:34

--
-- PostgreSQL database dump complete
--

\unrestrict DopURJHKZjfSubuRtUz5fXZqUrKsqs98mTfaar1MaXo1nB0tl11IM9RblNS4Vpa

