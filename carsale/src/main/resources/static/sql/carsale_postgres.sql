--
-- PostgreSQL database dump
--

\restrict MGL0M18mq20KDshSi1DeH0cX8d9QHkAHCaqxnLCiM6LjemYdThwezg19qbEOlBt

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

-- Started on 2025-12-31 21:54:55

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
-- TOC entry 863 (class 1247 OID 16416)
-- Name: account_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.account_status AS ENUM (
    'active',
    'inactive',
    'banned'
);


ALTER TYPE public.account_status OWNER TO postgres;

--
-- TOC entry 866 (class 1247 OID 16424)
-- Name: car_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.car_status AS ENUM (
    'available',
    'sold',
    'out_of_stock'
);


ALTER TYPE public.car_status OWNER TO postgres;

--
-- TOC entry 878 (class 1247 OID 16458)
-- Name: news_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.news_status AS ENUM (
    'draft',
    'published',
    'archived'
);


ALTER TYPE public.news_status OWNER TO postgres;

--
-- TOC entry 869 (class 1247 OID 16432)
-- Name: order_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status AS ENUM (
    'pending',
    'confirmed',
    'shipping',
    'completed',
    'cancelled'
);


ALTER TYPE public.order_status OWNER TO postgres;

--
-- TOC entry 872 (class 1247 OID 16444)
-- Name: payment_method; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_method AS ENUM (
    'cash',
    'bank_transfer',
    'credit_card'
);


ALTER TYPE public.payment_method OWNER TO postgres;

--
-- TOC entry 884 (class 1247 OID 16478)
-- Name: report_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.report_status AS ENUM (
    'active',
    'archived',
    'deleted'
);


ALTER TYPE public.report_status OWNER TO postgres;

--
-- TOC entry 881 (class 1247 OID 16466)
-- Name: report_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.report_type AS ENUM (
    'revenue',
    'user_activity',
    'feedback',
    'system',
    'custom'
);


ALTER TYPE public.report_type OWNER TO postgres;

--
-- TOC entry 875 (class 1247 OID 16452)
-- Name: visibility_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.visibility_status AS ENUM (
    'visible',
    'hidden'
);


ALTER TYPE public.visibility_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16511)
-- Name: account_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_roles (
    account_role_id integer NOT NULL,
    account_id integer NOT NULL,
    role_id integer NOT NULL,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT true
);


ALTER TABLE public.account_roles OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16510)
-- Name: account_roles_account_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_roles_account_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.account_roles_account_role_id_seq OWNER TO postgres;

--
-- TOC entry 4978 (class 0 OID 0)
-- Dependencies: 219
-- Name: account_roles_account_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_roles_account_role_id_seq OWNED BY public.account_roles.account_role_id;


--
-- TOC entry 218 (class 1259 OID 16495)
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    account_id integer NOT NULL,
    username character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    email character varying(150) NOT NULL,
    status character varying(255) DEFAULT 'active'::public.account_status,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    full_name character varying(100) NOT NULL,
    phone_number character varying(15),
    reset_token character varying(255)
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16494)
-- Name: accounts_account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accounts_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.accounts_account_id_seq OWNER TO postgres;

--
-- TOC entry 4979 (class 0 OID 0)
-- Dependencies: 217
-- Name: accounts_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.accounts_account_id_seq OWNED BY public.accounts.account_id;


--
-- TOC entry 222 (class 1259 OID 16530)
-- Name: cars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cars (
    car_id integer NOT NULL,
    car_name character varying(100) NOT NULL,
    brand character varying(50),
    price numeric(15,2) NOT NULL,
    description text,
    image_url character varying(255),
    status character varying(255) DEFAULT 'available'::public.car_status,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cars OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16529)
-- Name: cars_car_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cars_car_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cars_car_id_seq OWNER TO postgres;

--
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 221
-- Name: cars_car_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cars_car_id_seq OWNED BY public.cars.car_id;


--
-- TOC entry 226 (class 1259 OID 16556)
-- Name: cart_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_details (
    cart_detail_id integer NOT NULL,
    cart_id integer NOT NULL,
    car_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cart_details OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16555)
-- Name: cart_details_cart_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_details_cart_detail_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_details_cart_detail_id_seq OWNER TO postgres;

--
-- TOC entry 4981 (class 0 OID 0)
-- Dependencies: 225
-- Name: cart_details_cart_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_details_cart_detail_id_seq OWNED BY public.cart_details.cart_detail_id;


--
-- TOC entry 224 (class 1259 OID 16542)
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    cart_id integer NOT NULL,
    account_id integer NOT NULL
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16541)
-- Name: carts_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carts_cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carts_cart_id_seq OWNER TO postgres;

--
-- TOC entry 4982 (class 0 OID 0)
-- Dependencies: 223
-- Name: carts_cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carts_cart_id_seq OWNED BY public.carts.cart_id;


--
-- TOC entry 238 (class 1259 OID 24677)
-- Name: comment_replies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comment_replies (
    reply_id integer NOT NULL,
    comment_id integer NOT NULL,
    account_id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'visible'::character varying
);


ALTER TABLE public.comment_replies OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 24676)
-- Name: comment_replies_reply_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comment_replies_reply_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comment_replies_reply_id_seq OWNER TO postgres;

--
-- TOC entry 4983 (class 0 OID 0)
-- Dependencies: 237
-- Name: comment_replies_reply_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comment_replies_reply_id_seq OWNED BY public.comment_replies.reply_id;


--
-- TOC entry 234 (class 1259 OID 16634)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    comment_id integer NOT NULL,
    account_id integer NOT NULL,
    order_detail_id integer NOT NULL,
    rating integer NOT NULL,
    content text NOT NULL,
    review_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(255) DEFAULT 'visible'::public.visibility_status,
    CONSTRAINT comments_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16633)
-- Name: comments_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_comment_id_seq OWNER TO postgres;

--
-- TOC entry 4984 (class 0 OID 0)
-- Dependencies: 233
-- Name: comments_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_comment_id_seq OWNED BY public.comments.comment_id;


--
-- TOC entry 232 (class 1259 OID 16618)
-- Name: news; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news (
    news_id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    image_url character varying(255),
    author_account_id integer NOT NULL,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(255) DEFAULT 'draft'::public.news_status
);


ALTER TABLE public.news OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16617)
-- Name: news_news_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.news_news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.news_news_id_seq OWNER TO postgres;

--
-- TOC entry 4985 (class 0 OID 0)
-- Dependencies: 231
-- Name: news_news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.news_news_id_seq OWNED BY public.news.news_id;


--
-- TOC entry 230 (class 1259 OID 16593)
-- Name: order_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_details (
    order_detail_id integer NOT NULL,
    order_id integer NOT NULL,
    car_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    price_at_purchase numeric(15,2) NOT NULL,
    review_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    rating integer,
    content text,
    status character varying(255) DEFAULT 'visible'::public.visibility_status,
    CONSTRAINT order_details_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.order_details OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16592)
-- Name: order_details_order_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_details_order_detail_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_details_order_detail_id_seq OWNER TO postgres;

--
-- TOC entry 4986 (class 0 OID 0)
-- Dependencies: 229
-- Name: order_details_order_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_details_order_detail_id_seq OWNED BY public.order_details.order_detail_id;


--
-- TOC entry 228 (class 1259 OID 16577)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    account_id integer NOT NULL,
    total_price numeric(15,2) NOT NULL,
    order_status character varying(255) DEFAULT 'pending'::public.order_status,
    payment_method character varying(255) NOT NULL,
    order_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    delivery_address character varying(255) NOT NULL,
    phone_number character varying(20) NOT NULL,
    note character varying(255)
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16576)
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_order_id_seq OWNER TO postgres;

--
-- TOC entry 4987 (class 0 OID 0)
-- Dependencies: 227
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- TOC entry 236 (class 1259 OID 16658)
-- Name: reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reports (
    report_id integer NOT NULL,
    admin_id integer NOT NULL,
    report_type character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    file_path character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(255) DEFAULT 'active'::public.report_status
);


ALTER TABLE public.reports OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16657)
-- Name: reports_report_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reports_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reports_report_id_seq OWNER TO postgres;

--
-- TOC entry 4988 (class 0 OID 0)
-- Dependencies: 235
-- Name: reports_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reports_report_id_seq OWNED BY public.reports.report_id;


--
-- TOC entry 216 (class 1259 OID 16486)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    role_id integer NOT NULL,
    role_name character varying(50) NOT NULL,
    description character varying(255)
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16485)
-- Name: roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_role_id_seq OWNER TO postgres;

--
-- TOC entry 4989 (class 0 OID 0)
-- Dependencies: 215
-- Name: roles_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_role_id_seq OWNED BY public.roles.role_id;


--
-- TOC entry 4718 (class 2604 OID 16514)
-- Name: account_roles account_role_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_roles ALTER COLUMN account_role_id SET DEFAULT nextval('public.account_roles_account_role_id_seq'::regclass);


--
-- TOC entry 4714 (class 2604 OID 16498)
-- Name: accounts account_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts ALTER COLUMN account_id SET DEFAULT nextval('public.accounts_account_id_seq'::regclass);


--
-- TOC entry 4721 (class 2604 OID 16533)
-- Name: cars car_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cars ALTER COLUMN car_id SET DEFAULT nextval('public.cars_car_id_seq'::regclass);


--
-- TOC entry 4726 (class 2604 OID 16559)
-- Name: cart_details cart_detail_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_details ALTER COLUMN cart_detail_id SET DEFAULT nextval('public.cart_details_cart_detail_id_seq'::regclass);


--
-- TOC entry 4725 (class 2604 OID 16545)
-- Name: carts cart_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts ALTER COLUMN cart_id SET DEFAULT nextval('public.carts_cart_id_seq'::regclass);


--
-- TOC entry 4745 (class 2604 OID 24680)
-- Name: comment_replies reply_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_replies ALTER COLUMN reply_id SET DEFAULT nextval('public.comment_replies_reply_id_seq'::regclass);


--
-- TOC entry 4739 (class 2604 OID 16637)
-- Name: comments comment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN comment_id SET DEFAULT nextval('public.comments_comment_id_seq'::regclass);


--
-- TOC entry 4736 (class 2604 OID 16621)
-- Name: news news_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news ALTER COLUMN news_id SET DEFAULT nextval('public.news_news_id_seq'::regclass);


--
-- TOC entry 4732 (class 2604 OID 16596)
-- Name: order_details order_detail_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details ALTER COLUMN order_detail_id SET DEFAULT nextval('public.order_details_order_detail_id_seq'::regclass);


--
-- TOC entry 4729 (class 2604 OID 16580)
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- TOC entry 4742 (class 2604 OID 16661)
-- Name: reports report_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports ALTER COLUMN report_id SET DEFAULT nextval('public.reports_report_id_seq'::regclass);


--
-- TOC entry 4713 (class 2604 OID 16489)
-- Name: roles role_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN role_id SET DEFAULT nextval('public.roles_role_id_seq'::regclass);


--
-- TOC entry 4954 (class 0 OID 16511)
-- Dependencies: 220
-- Data for Name: account_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_roles (account_role_id, account_id, role_id, assigned_at, is_active) FROM stdin;
1	1	2	2025-12-25 15:14:09.19052	t
2	1	1	2025-12-25 15:14:09.207291	t
3	2	2	2025-12-25 15:27:51.462933	t
4	3	2	2025-12-25 16:38:39.885084	t
5	4	2	2025-12-29 21:15:26.92735	t
\.


--
-- TOC entry 4952 (class 0 OID 16495)
-- Dependencies: 218
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts (account_id, username, password_hash, email, status, created_at, updated_at, full_name, phone_number, reset_token) FROM stdin;
1	admin	$2a$10$InbohzPO.y2ulAmPqRjEfONxhU1qTK9gEfSVRkzrQjVaSVj3hD6ge	tqtoan11012004@gmail.com	active	2025-12-25 15:14:08.946837	2025-12-25 15:14:08.946837	admin	0123456789	\N
2	user1	$2a$10$gJj3feLFpFpu9rULJxJnN.lOSZnlbg1948w1s0UGEtklGL4nCAji6	user1@gmail.com	active	2025-12-25 15:27:51.315879	2025-12-25 15:27:51.315879	user1	0123456789	\N
3	user2	$2a$10$X74u5LypWhg8UcWdK9FI0e5e37l12FngHdt9Pk1z7hcLKrSmC0GE2	user2@gmail.com	active	2025-12-25 16:38:39.666935	2025-12-25 16:38:39.666935	user2	0123456789	\N
4	user3	$2a$10$2fiKSw8AYI/KbibntTgnE.F5I8IA0WmCgZ2YYJmVi/cR7LKoZAVVS	user3@gmail.com	active	2025-12-29 21:15:26.693146	2025-12-29 21:15:26.693146	user3	0123456789	\N
\.


--
-- TOC entry 4956 (class 0 OID 16530)
-- Dependencies: 222
-- Data for Name: cars; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cars (car_id, car_name, brand, price, description, image_url, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4960 (class 0 OID 16556)
-- Dependencies: 226
-- Data for Name: cart_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_details (cart_detail_id, cart_id, car_id, quantity, added_at) FROM stdin;
\.


--
-- TOC entry 4958 (class 0 OID 16542)
-- Dependencies: 224
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (cart_id, account_id) FROM stdin;
1	1
2	2
3	3
4	4
\.


--
-- TOC entry 4972 (class 0 OID 24677)
-- Dependencies: 238
-- Data for Name: comment_replies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comment_replies (reply_id, comment_id, account_id, content, created_at, status) FROM stdin;
\.


--
-- TOC entry 4968 (class 0 OID 16634)
-- Dependencies: 234
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (comment_id, account_id, order_detail_id, rating, content, review_date, status) FROM stdin;
\.


--
-- TOC entry 4966 (class 0 OID 16618)
-- Dependencies: 232
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news (news_id, title, content, image_url, author_account_id, date, status) FROM stdin;
\.


--
-- TOC entry 4964 (class 0 OID 16593)
-- Dependencies: 230
-- Data for Name: order_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_details (order_detail_id, order_id, car_id, quantity, price_at_purchase, review_date, rating, content, status) FROM stdin;
\.


--
-- TOC entry 4962 (class 0 OID 16577)
-- Dependencies: 228
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (order_id, account_id, total_price, order_status, payment_method, order_date, delivery_address, phone_number, note) FROM stdin;
\.


--
-- TOC entry 4970 (class 0 OID 16658)
-- Dependencies: 236
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reports (report_id, admin_id, report_type, title, description, file_path, created_at, status) FROM stdin;
\.


--
-- TOC entry 4950 (class 0 OID 16486)
-- Dependencies: 216
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (role_id, role_name, description) FROM stdin;
1	admin	System Administrator
2	user	Regular User
3	manager	Manager
\.


--
-- TOC entry 4990 (class 0 OID 0)
-- Dependencies: 219
-- Name: account_roles_account_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_roles_account_role_id_seq', 5, true);


--
-- TOC entry 4991 (class 0 OID 0)
-- Dependencies: 217
-- Name: accounts_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.accounts_account_id_seq', 4, true);


--
-- TOC entry 4992 (class 0 OID 0)
-- Dependencies: 221
-- Name: cars_car_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cars_car_id_seq', 1, false);


--
-- TOC entry 4993 (class 0 OID 0)
-- Dependencies: 225
-- Name: cart_details_cart_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_details_cart_detail_id_seq', 1, false);


--
-- TOC entry 4994 (class 0 OID 0)
-- Dependencies: 223
-- Name: carts_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carts_cart_id_seq', 4, true);


--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 237
-- Name: comment_replies_reply_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comment_replies_reply_id_seq', 1, false);


--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 233
-- Name: comments_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_comment_id_seq', 1, false);


--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 231
-- Name: news_news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.news_news_id_seq', 1, false);


--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 229
-- Name: order_details_order_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_details_order_detail_id_seq', 1, false);


--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 227
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 1, false);


--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 235
-- Name: reports_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reports_report_id_seq', 1, false);


--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 215
-- Name: roles_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_role_id_seq', 3, true);


--
-- TOC entry 4761 (class 2606 OID 16518)
-- Name: account_roles account_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_roles
    ADD CONSTRAINT account_roles_pkey PRIMARY KEY (account_role_id);


--
-- TOC entry 4755 (class 2606 OID 16509)
-- Name: accounts accounts_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_email_key UNIQUE (email);


--
-- TOC entry 4757 (class 2606 OID 16505)
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (account_id);


--
-- TOC entry 4759 (class 2606 OID 16507)
-- Name: accounts accounts_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_username_key UNIQUE (username);


--
-- TOC entry 4763 (class 2606 OID 16540)
-- Name: cars cars_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cars
    ADD CONSTRAINT cars_pkey PRIMARY KEY (car_id);


--
-- TOC entry 4769 (class 2606 OID 16565)
-- Name: cart_details cart_details_cart_id_car_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_details
    ADD CONSTRAINT cart_details_cart_id_car_id_key UNIQUE (cart_id, car_id);


--
-- TOC entry 4771 (class 2606 OID 16563)
-- Name: cart_details cart_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_details
    ADD CONSTRAINT cart_details_pkey PRIMARY KEY (cart_detail_id);


--
-- TOC entry 4765 (class 2606 OID 16549)
-- Name: carts carts_account_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_account_id_key UNIQUE (account_id);


--
-- TOC entry 4767 (class 2606 OID 16547)
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (cart_id);


--
-- TOC entry 4791 (class 2606 OID 24686)
-- Name: comment_replies comment_replies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_replies
    ADD CONSTRAINT comment_replies_pkey PRIMARY KEY (reply_id);


--
-- TOC entry 4785 (class 2606 OID 16646)
-- Name: comments comments_order_detail_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_order_detail_id_key UNIQUE (order_detail_id);


--
-- TOC entry 4787 (class 2606 OID 16644)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (comment_id);


--
-- TOC entry 4783 (class 2606 OID 16627)
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (news_id);


--
-- TOC entry 4777 (class 2606 OID 16606)
-- Name: order_details order_details_order_id_car_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_order_id_car_id_key UNIQUE (order_id, car_id);


--
-- TOC entry 4779 (class 2606 OID 16604)
-- Name: order_details order_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_pkey PRIMARY KEY (order_detail_id);


--
-- TOC entry 4775 (class 2606 OID 16586)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- TOC entry 4789 (class 2606 OID 16667)
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (report_id);


--
-- TOC entry 4751 (class 2606 OID 16491)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- TOC entry 4753 (class 2606 OID 16493)
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- TOC entry 4773 (class 2606 OID 24672)
-- Name: cart_details uk90y31edh9il6w98so8nm2q6m9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_details
    ADD CONSTRAINT uk90y31edh9il6w98so8nm2q6m9 UNIQUE (cart_id, car_id);


--
-- TOC entry 4781 (class 2606 OID 24674)
-- Name: order_details ukj6cmwhobcr05mutmsegxu65cq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT ukj6cmwhobcr05mutmsegxu65cq UNIQUE (order_id, car_id);


--
-- TOC entry 4792 (class 2606 OID 16519)
-- Name: account_roles account_roles_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_roles
    ADD CONSTRAINT account_roles_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(account_id) ON DELETE CASCADE;


--
-- TOC entry 4793 (class 2606 OID 16524)
-- Name: account_roles account_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_roles
    ADD CONSTRAINT account_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(role_id) ON DELETE CASCADE;


--
-- TOC entry 4795 (class 2606 OID 16571)
-- Name: cart_details cart_details_car_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_details
    ADD CONSTRAINT cart_details_car_id_fkey FOREIGN KEY (car_id) REFERENCES public.cars(car_id) ON DELETE CASCADE;


--
-- TOC entry 4796 (class 2606 OID 16566)
-- Name: cart_details cart_details_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_details
    ADD CONSTRAINT cart_details_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(cart_id) ON DELETE CASCADE;


--
-- TOC entry 4794 (class 2606 OID 16550)
-- Name: carts carts_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(account_id) ON DELETE CASCADE;


--
-- TOC entry 4801 (class 2606 OID 16647)
-- Name: comments comments_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(account_id) ON DELETE CASCADE;


--
-- TOC entry 4802 (class 2606 OID 16652)
-- Name: comments comments_order_detail_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_order_detail_id_fkey FOREIGN KEY (order_detail_id) REFERENCES public.order_details(order_detail_id) ON DELETE CASCADE;


--
-- TOC entry 4804 (class 2606 OID 24692)
-- Name: comment_replies fk_reply_account; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_replies
    ADD CONSTRAINT fk_reply_account FOREIGN KEY (account_id) REFERENCES public.accounts(account_id);


--
-- TOC entry 4805 (class 2606 OID 24687)
-- Name: comment_replies fk_reply_comment; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_replies
    ADD CONSTRAINT fk_reply_comment FOREIGN KEY (comment_id) REFERENCES public.comments(comment_id) ON DELETE CASCADE;


--
-- TOC entry 4800 (class 2606 OID 16628)
-- Name: news news_author_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_author_account_id_fkey FOREIGN KEY (author_account_id) REFERENCES public.accounts(account_id) ON DELETE CASCADE;


--
-- TOC entry 4798 (class 2606 OID 16612)
-- Name: order_details order_details_car_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_car_id_fkey FOREIGN KEY (car_id) REFERENCES public.cars(car_id) ON DELETE CASCADE;


--
-- TOC entry 4799 (class 2606 OID 16607)
-- Name: order_details order_details_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;


--
-- TOC entry 4797 (class 2606 OID 16587)
-- Name: orders orders_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(account_id) ON DELETE CASCADE;


--
-- TOC entry 4803 (class 2606 OID 16668)
-- Name: reports reports_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.accounts(account_id) ON DELETE CASCADE;


-- Completed on 2025-12-31 21:54:57

--
-- PostgreSQL database dump complete
--

\unrestrict MGL0M18mq20KDshSi1DeH0cX8d9QHkAHCaqxnLCiM6LjemYdThwezg19qbEOlBt

