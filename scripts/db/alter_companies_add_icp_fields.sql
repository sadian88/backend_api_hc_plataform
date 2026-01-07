ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS icp_industries TEXT[],
  ADD COLUMN IF NOT EXISTS icp_company_size VARCHAR(50),
  ADD COLUMN IF NOT EXISTS icp_target_country VARCHAR(100),
  ADD COLUMN IF NOT EXISTS icp_target_city VARCHAR(120),
  ADD COLUMN IF NOT EXISTS icp_industry_pain TEXT,
  ADD COLUMN IF NOT EXISTS icp_competitors TEXT[],
  ADD COLUMN IF NOT EXISTS icp_current_customers TEXT[];
