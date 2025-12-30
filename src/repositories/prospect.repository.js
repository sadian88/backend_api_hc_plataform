const pool = require('../db/pool');

const PROSPECT_FIELDS = `
  p.id,
  p.id_externo,
  p.nombre_completo,
  p.email,
  p.perfil_linkedin,
  p.cargo,
  p.about,
  p.location,
  p.estado,
  p.fecha_creacion_origen,
  p.company_id,
  p.company_origen_lead,
  p.created_at,
  p.updated_at,
  c.company_name AS company_name,
  p.company_origen_lead AS origen_company_name
`;

const buildFilters = (filters = {}) => {
  const clauses = [];
  const values = [];

  if (typeof filters.companyId === 'number') {
    values.push(filters.companyId);
    clauses.push(`p.company_id = $${values.length}`);
  }

  if (typeof filters.companyOrigenLead === 'string' && filters.companyOrigenLead.length) {
    values.push(filters.companyOrigenLead);
    clauses.push(`p.company_origen_lead = $${values.length}`);
  }

  if (filters.estado) {
    values.push(filters.estado);
    clauses.push(`LOWER(p.estado) = LOWER($${values.length})`);
  }

  return {
    where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
    values
  };
};

const findAll = async (filters = {}) => {
  const { where, values } = buildFilters(filters);
  const query = `
    SELECT ${PROSPECT_FIELDS}
    FROM prospectos p
    LEFT JOIN companies c ON c.id = p.company_id
    ${where}
    ORDER BY p.updated_at DESC NULLS LAST, p.nombre_completo ASC NULLS LAST
  `;
  const { rows } = await pool.query(query, values);
  return rows;
};

const findById = async (id) => {
  const query = `
    SELECT ${PROSPECT_FIELDS}
    FROM prospectos p
    LEFT JOIN companies c ON c.id = p.company_id
    WHERE p.id = $1
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

const updateProspect = async (id, payload) => {
  const query = `
    UPDATE prospectos
    SET
      nombre_completo = $1,
      email = $2,
      perfil_linkedin = $3,
      cargo = $4,
      about = $5,
      location = $6,
      estado = $7,
      fecha_creacion_origen = $8,
      company_id = $9,
      company_origen_lead = $10,
      updated_at = NOW()
    WHERE id = $11
    RETURNING id
  `;

  const values = [
    payload.nombreCompleto,
    payload.email,
    payload.perfilLinkedin,
    payload.cargo,
    payload.about,
    payload.location,
    payload.estado,
    payload.fechaCreacionOrigen,
    payload.companyId,
    payload.companyOrigenLead,
    id
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteProspect = async (id) => {
  await pool.query('DELETE FROM prospectos WHERE id = $1', [id]);
};

module.exports = {
  findAll,
  findById,
  updateProspect,
  deleteProspect
};
