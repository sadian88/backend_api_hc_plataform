const pool = require('../db/pool');

const SEARCH_RESULT_FIELDS = `
  src.company_id,
  src.link,
  src.title,
  src.redirect_link,
  src.displayed_link,
  src.source,
  src.icp_industries,
  src.icp_company_size,
  src.icp_target_country,
  src.icp_target_city,
  src.icp_industry_pain,
  src.icp_competitors,
  src.icp_current_customers,
  src.buyer_persona_name,
  src.buyer_persona_age,
  src.buyer_persona_role,
  src.buyer_persona_company_type,
  src.buyer_persona_location,
  src.buyer_persona_goals,
  src.buyer_persona_pain_points,
  src.buyer_persona_buying_behavior,
  src.buyer_persona_channels,
  c.company_name,
  src.company_id::text AS source_scraping
`;

const buildFilters = (filters = {}) => {
  const clauses = [];
  const values = [];

  if (typeof filters.sourceScraping === 'number') {
    values.push(filters.sourceScraping);
    clauses.push(`src.company_id = $${values.length}`);
  }

  return {
    where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
    values
  };
};

const findAll = async (filters = {}) => {
  const { where, values } = buildFilters(filters);
  const query = `
    SELECT ${SEARCH_RESULT_FIELDS}
    FROM search_results_companies src
    LEFT JOIN companies c ON c.id = src.company_id
    ${where}
    ORDER BY src.company_id ASC, src.link ASC
  `;
  const { rows } = await pool.query(query, values);
  return rows;
};

const findByComposite = async (companyId, link) => {
  const query = `
    SELECT ${SEARCH_RESULT_FIELDS}
    FROM search_results_companies src
    LEFT JOIN companies c ON c.id = src.company_id
    WHERE src.company_id = $1 AND src.link = $2
  `;
  const { rows } = await pool.query(query, [companyId, link]);
  return rows[0];
};

const updateEntry = async (companyId, link, payload) => {
  const query = `
    UPDATE search_results_companies
    SET
      title = $1,
      redirect_link = $2,
      displayed_link = $3,
      source = $4,
      icp_industries = $5,
      icp_company_size = $6,
      icp_target_country = $7,
      icp_target_city = $8,
      icp_industry_pain = $9,
      icp_competitors = $10,
      icp_current_customers = $11,
      buyer_persona_name = $12,
      buyer_persona_age = $13,
      buyer_persona_role = $14,
      buyer_persona_company_type = $15,
      buyer_persona_location = $16,
      buyer_persona_goals = $17,
      buyer_persona_pain_points = $18,
      buyer_persona_buying_behavior = $19,
      buyer_persona_channels = $20
    WHERE company_id = $21 AND link = $22
    RETURNING ${SEARCH_RESULT_FIELDS}
  `;

  const values = [
    payload.title,
    payload.redirectLink,
    payload.displayedLink,
    payload.source,
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
    companyId,
    link
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteEntry = async (companyId, link) => {
  await pool.query('DELETE FROM search_results_companies WHERE company_id = $1 AND link = $2', [
    companyId,
    link
  ]);
};

module.exports = {
  findAll,
  findByComposite,
  updateEntry,
  deleteEntry
};
