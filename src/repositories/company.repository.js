const pool = require('../db/pool');

const COMPANY_FIELDS =
  'id, company_name, company_url_profile, company_segment, customer_url_profile, company_icp, creation_date, last_update';

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
    INSERT INTO companies (company_name, company_url_profile, company_segment, customer_url_profile, company_icp, creation_date, last_update)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    RETURNING ${COMPANY_FIELDS}
  `;

  const values = [
    payload.companyName,
    payload.companyUrlProfile,
    payload.companySegment || null,
    payload.customerUrlProfile || null,
    payload.companyIcp || null,
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
      creation_date = $6,
      last_update = NOW()
    WHERE id = $7
    RETURNING ${COMPANY_FIELDS}
  `;

  const values = [
    payload.companyName,
    payload.companyUrlProfile,
    payload.companySegment || null,
    payload.customerUrlProfile || null,
    payload.companyIcp || null,
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
