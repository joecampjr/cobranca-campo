import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
    try {
        // SQL script from scripts/01-create-tables.sql
        const sql = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TENANTS & USERS
-- ============================================

-- Companies (tenants)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    document VARCHAR(20) UNIQUE NOT NULL, -- CNPJ
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    
    -- Asaas Integration
    asaas_api_key VARCHAR(255),
    asaas_wallet_id VARCHAR(100),
    
    -- Subscription
    plan_type VARCHAR(50) DEFAULT 'trial', -- trial, basic, professional, enterprise
    subscription_status VARCHAR(50) DEFAULT 'active', -- active, suspended, cancelled
    trial_ends_at TIMESTAMP,
    subscription_started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    
    -- Role: super_admin, company_admin, manager, collector, customer
    role VARCHAR(50) NOT NULL,
    
    -- Collector specific fields
    commission_percentage DECIMAL(5,2) DEFAULT 0,
    collection_goal DECIMAL(15,2) DEFAULT 0,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, suspended
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Session management
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CUSTOMERS & CHARGES
-- ============================================

-- Customers
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    document VARCHAR(20), -- CPF/CNPJ
    email VARCHAR(255),
    phone VARCHAR(20),
    
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Asaas customer ID
    asaas_customer_id VARCHAR(100),
    
    -- Customer tags for segmentation
    tags TEXT[], -- Array of tags
    notes TEXT,
    
    status VARCHAR(50) DEFAULT 'active', -- active, inactive
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Charges (Cobranças)
CREATE TABLE IF NOT EXISTS charges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    collector_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Charge details
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    due_date DATE NOT NULL,
    
    -- Payment info
    payment_method VARCHAR(50), -- pix, boleto, credit_card, money, debit_card
    installments INTEGER DEFAULT 1,
    
    -- Status: pending, confirmed, received, overdue, cancelled
    status VARCHAR(50) DEFAULT 'pending',
    
    -- Asaas integration
    asaas_payment_id VARCHAR(100),
    asaas_invoice_url TEXT,
    asaas_pix_code TEXT,
    asaas_pix_qr_code_url TEXT,
    asaas_boleto_url TEXT,
    
    -- Payment tracking
    paid_at TIMESTAMP,
    paid_amount DECIMAL(15,2),
    
    -- Geolocation for field collection
    collection_latitude DECIMAL(10, 8),
    collection_longitude DECIMAL(11, 8),
    collection_address TEXT,
    
    -- Attachments
    receipt_url TEXT,
    proof_of_payment_url TEXT,
    
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ROUTES & VISITS
-- ============================================

-- Collection Routes
CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    collector_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'planned', -- planned, in_progress, completed
    
    -- Route optimization
    optimized_order JSON, -- Array of customer IDs in optimal order
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Route customers (many-to-many)
CREATE TABLE IF NOT EXISTS route_customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    visit_order INTEGER,
    
    -- Visit status: pending, completed, skipped
    status VARCHAR(50) DEFAULT 'pending',
    visited_at TIMESTAMP,
    
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- NOTIFICATIONS & WEBHOOKS
-- ============================================

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- payment, system, route, alert
    
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Optional link
    link_url TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Webhook logs (from Asaas)
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    
    event_type VARCHAR(100) NOT NULL,
    payload JSON NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP,
    error_message TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- REPORTS & ANALYTICS
-- ============================================

-- Daily collection summaries (materialized for performance)
CREATE TABLE IF NOT EXISTS daily_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    collector_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    date DATE NOT NULL,
    
    total_charges INTEGER DEFAULT 0,
    charges_collected INTEGER DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    collected_amount DECIMAL(15,2) DEFAULT 0,
    commission_earned DECIMAL(15,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(company_id, collector_id, date)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE INDEX IF NOT EXISTS idx_customers_company_id ON customers(company_id);
CREATE INDEX IF NOT EXISTS idx_customers_document ON customers(document);

CREATE INDEX IF NOT EXISTS idx_charges_company_id ON charges(company_id);
CREATE INDEX IF NOT EXISTS idx_charges_customer_id ON charges(customer_id);
CREATE INDEX IF NOT EXISTS idx_charges_collector_id ON charges(collector_id);
CREATE INDEX IF NOT EXISTS idx_charges_status ON charges(status);
CREATE INDEX IF NOT EXISTS idx_charges_due_date ON charges(due_date);

CREATE INDEX IF NOT EXISTS idx_routes_company_id ON routes(company_id);
CREATE INDEX IF NOT EXISTS idx_routes_collector_id ON routes(collector_id);
CREATE INDEX IF NOT EXISTS idx_routes_date ON routes(date);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    `

        // Split logic: Postgres normally handles multiple statements, but creating indexes concurrently might fail in transaction blocks if not careful.
        // However, @vercel/postgres pool.query should support multi-statement sql if it's just raw text.
        // If not, we might need to split by ';'.
        // Safe bet: split by ';' and filter empty.

        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            await db.query(statement);
        }

        return NextResponse.json({ message: "Tables created successfully" })
    } catch (error: any) {
        console.error("Setup error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
