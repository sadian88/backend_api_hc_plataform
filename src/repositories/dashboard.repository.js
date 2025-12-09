const pool = require('../db/pool');

const getSummary = async () => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM companies) AS company_count,
      (SELECT COUNT(*) FROM leads) AS lead_count,
      (SELECT COUNT(*) FROM search_results_companies) AS search_result_count,
      (SELECT COALESCE(MAX(updated_at), NOW()) FROM leads) AS latest_lead_update,
      NOW() AS latest_search_result_update
  `;
  const { rows } = await pool.query(query);
  return rows[0];
};

const getRecentLeads = async () => {
  const query = `
    SELECT
      l.id_lead,
      l.nombre,
      l.cargo,
      l.updated_at,
      c.company_name
    FROM leads l
    LEFT JOIN companies c ON c.id = l.company_id
    ORDER BY l.updated_at DESC
    LIMIT 2
  `;
  const { rows } = await pool.query(query);
  return rows;
};

const getTopCompanies = async () => {
  const query = `
    SELECT
      c.id,
      c.company_name,
      COUNT(sr.link) AS search_results
    FROM companies c
    LEFT JOIN search_results_companies sr ON sr.company_id = c.id
    GROUP BY c.id, c.company_name
    ORDER BY search_results DESC
    LIMIT 2
  `;
  const { rows } = await pool.query(query);
  return rows;
};

module.exports = {
  getSummary,
  getRecentLeads,
  getTopCompanies
};
