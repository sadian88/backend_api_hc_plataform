const pool = require('../db/pool');

const COMPANY_FIELDS =
  'id, company_name, company_url_profile, company_segment, customer_url_profile, company_icp, icp_industries, icp_company_size, icp_target_country, icp_target_city, icp_industry_pain, icp_competitors, icp_current_customers, buyer_persona_name, buyer_persona_age, buyer_persona_role, buyer_persona_company_type, buyer_persona_location, buyer_persona_goals, buyer_persona_pain_points, buyer_persona_buying_behavior, buyer_persona_channels, creation_date, last_update';

const findAll = async () => {
  const query = `SELECT ${COMPANY_FIELDS} FROM companies ORDER BY company_name ASC`;
  const { rows } = await pool.query(query);
  return rows;
};

const findById = async (id) => {
  const query = `SELECT ${COMPANY_FIELDS} FROM companies WHERE id = $1`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

const createCompany = async (payload) => {
  const query = `
    INSERT INTO companies (
      company_name,
      company_url_profile,
      company_segment,
      customer_url_profile,
      company_icp,
      icp_industries,
      icp_company_size,
      icp_target_country,
      icp_target_city,
      icp_industry_pain,
      icp_competitors,
      icp_current_customers,
      buyer_persona_name,
      buyer_persona_age,
      buyer_persona_role,
      buyer_persona_company_type,
      buyer_persona_location,
      buyer_persona_goals,
      buyer_persona_pain_points,
      buyer_persona_buying_behavior,
      buyer_persona_channels,
      creation_date,
      last_update
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, NOW())
    RETURNING ${COMPANY_FIELDS}
  `;

  const values = [
    payload.companyName,
    payload.companyUrlProfile,
    payload.companySegment || null,
    payload.customerUrlProfile || null,
    payload.companyIcp || null,
    payload.icpIndustries || null,
    payload.icpCompanySize || null,
    payload.icpTargetCountry || null,
    payload.icpTargetCity || null,
    payload.icpIndustryPain || null,
    payload.icpCompetitors || null,
    payload.icpCurrentCustomers || null,
    payload.buyerPersonaName || null,
    payload.buyerPersonaAge || null,
    payload.buyerPersonaRole || null,
    payload.buyerPersonaCompanyType || null,
    payload.buyerPersonaLocation || null,
    payload.buyerPersonaGoals || null,
    payload.buyerPersonaPainPoints || null,
    payload.buyerPersonaBuyingBehavior || null,
    payload.buyerPersonaChannels || null,
    payload.creationDate || null
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const updateCompany = async (id, payload) => {
  const query = `
    UPDATE companies
    SET
      company_name = $1,
      company_url_profile = $2,
      company_segment = $3,
      customer_url_profile = $4,
      company_icp = $5,
      icp_industries = $6,
      icp_company_size = $7,
      icp_target_country = $8,
      icp_target_city = $9,
      icp_industry_pain = $10,
      icp_competitors = $11,
      icp_current_customers = $12,
      buyer_persona_name = $13,
      buyer_persona_age = $14,
      buyer_persona_role = $15,
      buyer_persona_company_type = $16,
      buyer_persona_location = $17,
      buyer_persona_goals = $18,
      buyer_persona_pain_points = $19,
      buyer_persona_buying_behavior = $20,
      buyer_persona_channels = $21,
      creation_date = $22,
      last_update = NOW()
    WHERE id = $23
    RETURNING ${COMPANY_FIELDS}
  `;

  const values = [
    payload.companyName,
    payload.companyUrlProfile,
    payload.companySegment || null,
    payload.customerUrlProfile || null,
    payload.companyIcp || null,
    payload.icpIndustries || null,
    payload.icpCompanySize || null,
    payload.icpTargetCountry || null,
    payload.icpTargetCity || null,
    payload.icpIndustryPain || null,
    payload.icpCompetitors || null,
    payload.icpCurrentCustomers || null,
    payload.buyerPersonaName || null,
    payload.buyerPersonaAge || null,
    payload.buyerPersonaRole || null,
    payload.buyerPersonaCompanyType || null,
    payload.buyerPersonaLocation || null,
    payload.buyerPersonaGoals || null,
    payload.buyerPersonaPainPoints || null,
    payload.buyerPersonaBuyingBehavior || null,
    payload.buyerPersonaChannels || null,
    payload.creationDate || null,
    id
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteCompany = async (id) => {
  await pool.query('DELETE FROM companies WHERE id = $1', [id]);
};

module.exports = {
  findAll,
  findById,
  createCompany,
  updateCompany,
  deleteCompany
};
