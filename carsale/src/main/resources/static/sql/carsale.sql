-- =========================================================
-- DATABASE: CarSale
-- =========================================================

CREATE DATABASE IF NOT EXISTS carsale CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE carsale;

-- =========================================================
-- ROLES
-- =========================================================

CREATE TABLE roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);

-- =========================================================
-- ACCOUNTS
-- =========================================================

CREATE TABLE accounts (
    account_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15)
);

-- =========================================================
-- ACCOUNT ROLES (N-N)
-- =========================================================

CREATE TABLE account_roles (
    account_role_id INT PRIMARY KEY AUTO_INCREMENT,
    account_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
        ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
        ON DELETE CASCADE
);

-- =========================================================
-- CARS
-- =========================================================

CREATE TABLE cars (
    car_id INT PRIMARY KEY AUTO_INCREMENT,
    car_name VARCHAR(100) NOT NULL,
    brand VARCHAR(50),
    price DECIMAL(15,2) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    status ENUM('available','sold','out_of_stock') DEFAULT 'available',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================================
-- CART (1-1 ACCOUNT)
-- =========================================================

CREATE TABLE carts (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    account_id INT UNIQUE NOT NULL,

    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
        ON DELETE CASCADE
);

-- =========================================================
-- CART DETAIL (1-N)
-- =========================================================

CREATE TABLE cart_details (
    cart_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    cart_id INT NOT NULL,
    car_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(cart_id, car_id),

    FOREIGN KEY (cart_id) REFERENCES carts(cart_id)
        ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(car_id)
        ON DELETE CASCADE
);

-- =========================================================
-- ORDERS
-- =========================================================

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    account_id INT NOT NULL,
    total_price DECIMAL(15,2) NOT NULL,

    order_status ENUM('pending','confirmed','shipping','completed','cancelled')
        DEFAULT 'pending',
    payment_method ENUM('cash','bank_transfer','credit_card') NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    delivery_address VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    note VARCHAR(255),

    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
        ON DELETE CASCADE
);

-- =========================================================
-- ORDER DETAIL
-- =========================================================

CREATE TABLE order_details (
    order_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    car_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price_at_purchase DECIMAL(15,2) NOT NULL,
    review_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    content TEXT,
    status ENUM('visible','hidden') DEFAULT 'visible',

    UNIQUE(order_id, car_id),

    FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(car_id)
        ON DELETE CASCADE
);

-- =========================================================
-- NEWS (Bài viết)
-- =========================================================

CREATE TABLE news (
    news_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    author_account_id INT NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('draft','published','archived') DEFAULT 'draft',

    FOREIGN KEY (author_account_id) REFERENCES accounts(account_id)
        ON DELETE CASCADE
);

-- =========================================================
-- COMMENTS
-- =========================================================

CREATE TABLE comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    account_id INT NOT NULL,
    order_detail_id INT UNIQUE NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    content TEXT NOT NULL,
    review_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('visible','hidden') DEFAULT 'visible',

    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
        ON DELETE CASCADE,
    FOREIGN KEY (order_detail_id) REFERENCES order_details(order_detail_id)
        ON DELETE CASCADE
);

-- =========================================================
-- REPORTS
-- =========================================================

CREATE TABLE reports (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    report_type ENUM('revenue','user_activity','feedback','system','custom') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active','archived','deleted') DEFAULT 'active',

    FOREIGN KEY (admin_id) REFERENCES accounts(account_id)
        ON DELETE CASCADE
);
