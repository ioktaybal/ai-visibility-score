-- Supabase Table Schema for AI Visibility Score

-- 1. Domains Table
CREATE TABLE IF NOT EXISTS domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain TEXT UNIQUE NOT NULL,
    last_scan TIMESTAMPTZ DEFAULT now(),
    scan_count INTEGER DEFAULT 1,
    industry_type TEXT,
    healthcare_type TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID REFERENCES domains(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    
    -- Psychological / Risk scores
    ai_discoverability_risk TEXT CHECK (ai_discoverability_risk IN ('HIGH', 'MEDIUM', 'LOW')) NOT NULL,
    google_entity_authority TEXT CHECK (google_entity_authority IN ('STRONG', 'MEDIUM', 'WEAK')) NOT NULL,
    chatgpt_understanding TEXT CHECK (chatgpt_understanding IN ('STRONG', 'MEDIUM', 'WEAK')) NOT NULL,
    healthcare_knowledge_graph TEXT CHECK (healthcare_knowledge_graph IN ('STRONG', 'MEDIUM', 'WEAK')) NOT NULL,
    ai_ecosystem_readiness TEXT CHECK (ai_ecosystem_readiness IN ('STRONG', 'MEDIUM', 'WEAK')) NOT NULL,
    
    -- Numeric scores
    overall_score INTEGER NOT NULL,
    seo_score INTEGER NOT NULL,
    geo_score INTEGER NOT NULL,
    geo_opportunity_score INTEGER NOT NULL,
    ai_visibility_score INTEGER NOT NULL,
    authority_score INTEGER NOT NULL,
    trust_score INTEGER NOT NULL,
    
    -- JSON Data fields
    ai_model_perception JSONB,
    conversational_queries JSONB,
    visibility_opportunity JSONB,
    entities JSONB,
    raw_extracted_data JSONB,
    pdf_report_data JSONB,
    client_name TEXT,
    client_location TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Recommendations Table
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    severity TEXT CHECK (severity IN ('High', 'Medium', 'Low')) NOT NULL,
    type TEXT CHECK (type IN ('Schema', 'Content', 'Authority', 'Technical', 'GEO')) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    potential_impact JSONB,
    estimated_lift TEXT,
    confidence_score INTEGER NOT NULL,
    evidence JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    followup_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Migration statement to update existing tables if they already exist
ALTER TABLE leads ADD COLUMN IF NOT EXISTS followup_sent BOOLEAN DEFAULT false;

-- Enable RLS and create public insert/read policies if needed, or bypass RLS if not configured.
-- For standard anonymous CRUD (ensure anonymous users can insert/select):
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on domains" ON domains FOR SELECT USING (true);
CREATE POLICY "Allow public insert on domains" ON domains FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on domains" ON domains FOR UPDATE USING (true);

CREATE POLICY "Allow public select on reports" ON reports FOR SELECT USING (true);
CREATE POLICY "Allow public insert on reports" ON reports FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on recommendations" ON recommendations FOR SELECT USING (true);
CREATE POLICY "Allow public insert on recommendations" ON recommendations FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert on leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on leads" ON leads FOR SELECT USING (true);
CREATE POLICY "Allow public update on leads" ON leads FOR UPDATE USING (true);
