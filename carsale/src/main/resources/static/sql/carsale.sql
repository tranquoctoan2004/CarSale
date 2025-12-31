-- ==========================================================
-- PostgreSQL Database Dump (Làm sạch cho Cloud SQL)
-- Project: Carsale Postgres
-- ==========================================================

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- 1. KHỞI TẠO CÁC KIỂU ENUM (TYPE)
CREATE TYPE public.account_status AS ENUM ('active', 'inactive', 'banned');
CREATE TYPE public.car_status AS ENUM ('available', 'sold', 'out_of_stock');
CREATE TYPE public.news_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'shipping', 'completed', 'cancelled');
CREATE TYPE public.payment_method AS ENUM ('cash', 'bank_transfer', 'credit_card');
CREATE TYPE public.report_status AS ENUM ('active', 'archived', 'deleted');
CREATE TYPE public.report_type AS ENUM ('revenue', 'user_activity', 'feedback', 'system', 'custom');
CREATE TYPE public.visibility_status AS ENUM ('visible', 'hidden');

-- 2. TẠO CÁC BẢNG CƠ SỞ (BASE TABLES)

-- Bảng Roles
CREATE TABLE public.roles (
    role_id SERIAL PRIMARY KEY,
    role_name character varying(50) NOT NULL UNIQUE,
    description character varying(255)
);

-- Bảng Accounts
CREATE TABLE public.accounts (
    account_id SERIAL PRIMARY KEY,
    username character varying(100) NOT NULL UNIQUE,
    password_hash character varying(255) NOT NULL,
    email character varying(150) NOT NULL UNIQUE,
    status character varying(255) DEFAULT 'active'::public.account_status,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    full_name character varying(100) NOT NULL,
    phone_number character varying(15),
    reset_token character varying(255)
);

-- Bảng Account Roles (Bảng trung gian)
CREATE TABLE public.account_roles (
    account_role_id SERIAL PRIMARY KEY,
    account_id integer NOT NULL REFERENCES public.accounts(account_id) ON DELETE CASCADE,
    role_id integer NOT NULL REFERENCES public.roles(role_id) ON DELETE CASCADE,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT true
);

-- Bảng Cars
CREATE TABLE public.cars (
    car_id SERIAL PRIMARY KEY,
    car_name character varying(100) NOT NULL,
    brand character varying(50),
    price numeric(15,2) NOT NULL,
    description text,
    image_url character varying(255),
    status character varying(255) DEFAULT 'available'::public.car_status,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Carts
CREATE TABLE public.carts (
    cart_id SERIAL PRIMARY KEY,
    account_id integer NOT NULL UNIQUE REFERENCES public.accounts(account_id) ON DELETE CASCADE
);

-- Bảng Cart Details
CREATE TABLE public.cart_details (
    cart_detail_id SERIAL PRIMARY KEY,
    cart_id integer NOT NULL REFERENCES public.carts(cart_id) ON DELETE CASCADE,
    car_id integer NOT NULL REFERENCES public.cars(car_id) ON DELETE CASCADE,
    quantity integer DEFAULT 1 NOT NULL,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cart_details_unique UNIQUE (cart_id, car_id)
);

-- Bảng Orders
CREATE TABLE public.orders (
    order_id SERIAL PRIMARY KEY,
    account_id integer NOT NULL REFERENCES public.accounts(account_id) ON DELETE CASCADE,
    total_price numeric(15,2) NOT NULL,
    order_status character varying(255) DEFAULT 'pending'::public.order_status,
    payment_method character varying(255) NOT NULL,
    order_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    delivery_address character varying(255) NOT NULL,
    phone_number character varying(20) NOT NULL,
    note character varying(255)
);

-- Bảng Order Details
CREATE TABLE public.order_details (
    order_detail_id SERIAL PRIMARY KEY,
    order_id integer NOT NULL REFERENCES public.orders(order_id) ON DELETE CASCADE,
    car_id integer NOT NULL REFERENCES public.cars(car_id) ON DELETE CASCADE,
    quantity integer DEFAULT 1 NOT NULL,
    price_at_purchase numeric(15,2) NOT NULL,
    review_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    rating integer CHECK (rating >= 1 AND rating <= 5),
    content text,
    status character varying(255) DEFAULT 'visible'::public.visibility_status,
    CONSTRAINT order_details_unique UNIQUE (order_id, car_id)
);

-- Bảng News
CREATE TABLE public.news (
    news_id SERIAL PRIMARY KEY,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    image_url character varying(255),
    author_account_id integer NOT NULL REFERENCES public.accounts(account_id),
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(255) DEFAULT 'draft'::public.news_status
);

-- Bảng Comments
CREATE TABLE public.comments (
    comment_id SERIAL PRIMARY KEY,
    account_id integer NOT NULL REFERENCES public.accounts(account_id),
    order_detail_id integer NOT NULL UNIQUE REFERENCES public.order_details(order_detail_id),
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content text NOT NULL,
    review_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(255) DEFAULT 'visible'::public.visibility_status
);

-- Bảng Comment Replies
CREATE TABLE public.comment_replies (
    reply_id SERIAL PRIMARY KEY,
    comment_id integer NOT NULL REFERENCES public.comments(comment_id) ON DELETE CASCADE,
    account_id integer NOT NULL REFERENCES public.accounts(account_id),
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'visible'
);

-- Bảng Reports
CREATE TABLE public.reports (
    report_id SERIAL PRIMARY KEY,
    admin_id integer NOT NULL REFERENCES public.accounts(account_id),
    report_type character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    file_path character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(255) DEFAULT 'active'::public.report_status
);

-- 3. CHÈN DỮ LIỆU (DATA INSERT)

-- Roles
INSERT INTO public.roles (role_id, role_name, description) VALUES
(1, 'admin', 'System Administrator'),
(2, 'user', 'Regular User'),
(3, 'manager', 'Manager');

-- Accounts
INSERT INTO public.accounts (account_id, username, password_hash, email, status, full_name, phone_number) VALUES
(1, 'admin', '$2a$10$InbohzPO.y2ulAmPqRjEfONxhU1qTK9gEfSVRkzrQjVaSVj3hD6ge', 'tqtoan11012004@gmail.com', 'active', 'admin', '0123456789'),
(2, 'user1', '$2a$10$gJj3feLFpFpu9rULJxJnN.lOSZnlbg1948w1s0UGEtklGL4nCAji6', 'user1@gmail.com', 'active', 'user1', '0123456789'),
(3, 'user2', '$2a$10$X74u5LypWhg8UcWdK9FI0e5e37l12FngHdt9Pk1z7hcLKrSmC0GE2', 'user2@gmail.com', 'active', 'user2', '0123456789'),
(4, 'user3', '$2a$10$2fiKSw8AYI/KbibntTgnE.F5I8IA0WmCgZ2YYJmVi/cR7LKoZAVVS', 'user3@gmail.com', 'active', 'user3', '0123456789');

-- Account Roles
INSERT INTO public.account_roles (account_id, role_id, is_active) VALUES
(1, 2, true),
(1, 1, true),
(2, 2, true),
(3, 2, true),
(4, 2, true);

-- Carts
INSERT INTO public.carts (account_id) VALUES (1), (2), (3), (4);

-- 4. ĐẶT LẠI GIÁ TRỊ SEQUENCE (Để tránh lỗi trùng ID khi tạo mới)
SELECT pg_catalog.setval('public.roles_role_id_seq', 3, true);
SELECT pg_catalog.setval('public.accounts_account_id_seq', 4, true);
SELECT pg_catalog.setval('public.carts_cart_id_seq', 4, true);
SELECT pg_catalog.setval('public.account_roles_account_role_id_seq', 5, true);