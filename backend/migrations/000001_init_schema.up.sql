-- PostgreSQL 16+ Schema for Krea Nova Relational Store
-- Compliant with 3FN/BCNF, Double-Entry Ledger, PII Encryption at Rest & Regulatory Rules

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users & Identity
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(32),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('investor', 'developer', 'admin')),
    user_type VARCHAR(32) NOT NULL CHECK (user_type IN ('individual', 'corporate')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Investor Profiles (Encrypted PII for Ley 25.326 compliance)
CREATE TABLE IF NOT EXISTS investor_profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE REFERENCES users(id) ON DELETE RESTRICT,
    full_name VARCHAR(200) NOT NULL,
    dni_encrypted TEXT NOT NULL,
    cuil_encrypted TEXT NOT NULL,
    birth_date VARCHAR(20) NOT NULL,
    address_encrypted TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    funds_origin VARCHAR(200) NOT NULL,
    is_pep BOOLEAN NOT NULL DEFAULT FALSE,
    is_obligated_subject BOOLEAN NOT NULL DEFAULT FALSE,
    kyc_status VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
    verified_at TIMESTAMPTZ
);

-- 3. Developer Profiles
CREATE TABLE IF NOT EXISTS developer_profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE REFERENCES users(id) ON DELETE RESTRICT,
    company_name VARCHAR(200) NOT NULL,
    trade_name VARCHAR(200),
    company_type VARCHAR(50) NOT NULL CHECK (company_type IN ('SA', 'SAS', 'SRL', 'Fideicomiso', 'Other')),
    cuit VARCHAR(32) NOT NULL UNIQUE,
    registration_number VARCHAR(100),
    legal_address TEXT NOT NULL,
    rep_full_name VARCHAR(200) NOT NULL,
    rep_role VARCHAR(100) NOT NULL,
    rep_dni_encrypted TEXT NOT NULL,
    rep_cuil_encrypted TEXT NOT NULL,
    ubo_declared BOOLEAN NOT NULL DEFAULT FALSE,
    verification_status VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verified_at TIMESTAMPTZ
);

-- 4. Legal Consents (Immutable audit log)
CREATE TABLE IF NOT EXISTS legal_consents (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    consent_type VARCHAR(50) NOT NULL CHECK (consent_type IN ('terms_and_conditions', 'privacy_policy', 'sworn_truth', 'marketing')),
    document_version VARCHAR(32) NOT NULL,
    document_hash VARCHAR(128) NOT NULL,
    ip_address VARCHAR(64) NOT NULL,
    accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Real Estate Projects / Funds
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY,
    developer_id VARCHAR(64) NOT NULL,
    name VARCHAR(200) NOT NULL,
    location VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    funding_goal BIGINT NOT NULL CHECK (funding_goal > 0),
    funds_raised BIGINT NOT NULL DEFAULT 0 CHECK (funds_raised >= 0),
    progress INT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status VARCHAR(32) NOT NULL CHECK (status IN ('draft', 'under_review', 'approved', 'rejected', 'published')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Direct Investments
CREATE TABLE IF NOT EXISTS investments (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
    investor_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
    status VARCHAR(32) NOT NULL CHECK (status IN ('pending', 'active', 'cancelled', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Ledger Accounts (Custody Escrow, Investor Wallets, Fees)
CREATE TABLE IF NOT EXISTS ledger_accounts (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('fiat_escrow', 'investor_wallet', 'platform_fee', 'token_pool')),
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Ledger Entries (Double-Entry Bookkeeping - Immutable)
CREATE TABLE IF NOT EXISTS ledger_entries (
    id VARCHAR(64) PRIMARY KEY,
    account_id VARCHAR(64) NOT NULL REFERENCES ledger_accounts(id) ON DELETE RESTRICT,
    transaction_group_id VARCHAR(64) NOT NULL,
    entry_type VARCHAR(10) NOT NULL CHECK (entry_type IN ('DEBIT', 'CREDIT')),
    amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
    reference_type VARCHAR(50) NOT NULL,
    reference_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for Foreign Keys and Query Performance
CREATE INDEX IF NOT EXISTS idx_investor_profiles_user_id ON investor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_developer_profiles_user_id ON developer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_legal_consents_user_id ON legal_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_investments_project_id ON investments(project_id);
CREATE INDEX IF NOT EXISTS idx_investments_investor_id ON investments(investor_id);
CREATE INDEX IF NOT EXISTS idx_ledger_accounts_user_type ON ledger_accounts(user_id, account_type);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_account_id ON ledger_entries(account_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_tx_group ON ledger_entries(transaction_group_id);
