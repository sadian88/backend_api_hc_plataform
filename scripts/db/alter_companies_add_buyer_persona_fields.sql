ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS buyer_persona_name VARCHAR(150),
  ADD COLUMN IF NOT EXISTS buyer_persona_age INTEGER,
  ADD COLUMN IF NOT EXISTS buyer_persona_role VARCHAR(150),
  ADD COLUMN IF NOT EXISTS buyer_persona_company_type VARCHAR(150),
  ADD COLUMN IF NOT EXISTS buyer_persona_location VARCHAR(150),
  ADD COLUMN IF NOT EXISTS buyer_persona_goals TEXT,
  ADD COLUMN IF NOT EXISTS buyer_persona_pain_points TEXT,
  ADD COLUMN IF NOT EXISTS buyer_persona_buying_behavior TEXT,
  ADD COLUMN IF NOT EXISTS buyer_persona_channels TEXT[];
