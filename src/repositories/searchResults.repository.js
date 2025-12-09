const pool = require('../db/pool');

const SEARCH_RESULT_FIELDS = `
  src.company_id,
  src.link,
  src.title,
  src.redirect_link,
  src.displayed_link,
  src.source,
  c.company_name
`;

const findAll = async () => {
  const query = `
    SELECT ${SEARCH_RESULT_FIELDS}
    FROM search_results_companies src
    LEFT JOIN companies c ON c.id = src.company_id
    ORDER BY src.company_id ASC, src.link ASC
  `;
  const { rows } = await pool.query(query);
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
      source = $4
    WHERE company_id = $5 AND link = $6
    RETURNING ${SEARCH_RESULT_FIELDS}
  `;

  const values = [
    payload.title,
    payload.redirectLink,
    payload.displayedLink,
    payload.source,
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
