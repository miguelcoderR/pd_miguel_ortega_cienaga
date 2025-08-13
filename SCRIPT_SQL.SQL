-- ========= CREACIÓN DE LA BASE DE DATOS =========
CREATE DATABASE IF NOT EXISTS pd_miguel_ortega_cienaga;
USE pd_miguel_ortega_cienaga;

-- ========= PREPARACIÓN (Borrado limpio de tablas si existen) =========
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS transactions, invoices, clients, platforms;

-- ========= TABLAS FUERTES (Entidades Principales) =========

-- Tabla: platforms
-- Almacena: Plataforma Utilizada
CREATE TABLE platforms (
    platform_id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL UNIQUE, -- <-- Aquí va 'Plataforma Utilizada'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: clients
-- Almacena: Nombre del Cliente, Número de Identificación, Dirección, Teléfono, Correo Electrónico
CREATE TABLE clients (
    client_id INT PRIMARY KEY AUTO_INCREMENT,
    identification_number VARCHAR(50) NOT NULL UNIQUE, -- <-- 'Número de Identificación'
    full_name VARCHAR(255) NOT NULL,                 -- <-- 'Nombre del Cliente'
    email VARCHAR(255) NOT NULL UNIQUE,              -- <-- 'Correo Electrónico'
    phone VARCHAR(50),                               -- <-- 'Teléfono'
    address TEXT,                                    -- <-- 'Dirección'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========= TABLAS DEPENDIENTES =========

-- Table: invoices
-- Almacena: Número de Factura, Periodo de Facturación, Monto Facturado
CREATE TABLE invoices (
    invoice_id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_number VARCHAR(100) NOT NULL UNIQUE, -- <-- 'Número de Factura'
    client_id INT NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,      -- <-- 'Monto Facturado'
    billing_period VARCHAR(50),                -- <-- 'Periodo de Facturación'
    issue_date DATE NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK(`status` IN ('pending', 'paid', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

-- Table: transactions
-- Almacena: ID de la Transacción, Fecha y Hora, Monto de la Transacción (Monto Pagado), Estado y Tipo
CREATE TABLE transactions (
    transaction_id VARCHAR(100) PRIMARY KEY,     -- <-- 'ID de la Transacción'
    invoice_id INT NOT NULL,
    platform_id INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,              -- <-- 'Monto de la Transacción' / 'Monto Pagado'
    transaction_date DATETIME NOT NULL,          -- <-- 'Fecha y Hora de la Transacción'
    `type` VARCHAR(50) NOT NULL,                 -- <-- 'Tipo de Transacción'
    `status` VARCHAR(50) NOT NULL,               -- <-- 'Estado de la Transacción'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id),
    FOREIGN KEY (platform_id) REFERENCES platforms(platform_id)
);

-- ========= FINALIZACIÓN Y DATOS INICIALES =========
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO platforms (`name`) VALUES ('Nequi'), ('Daviplata'), ('PSE'), ('Bancolombia');

SELECT 'Base de datos creada exitosamente con los 15 campos requeridos.' AS message;