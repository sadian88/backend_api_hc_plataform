const pool = require('../db/pool');

const ANALISIS_LEADS_ICP_FIELDS = `
  a.id,
  a.origen_lead_id,
  a.nombre_empresa,
  a.linkedin_url,
  a.web_url,
  a.headcount,
  a.ubicacion_empresa,
  a.descripcion_corta,
  a.especialidades,
  a.puntuacion_industria,
  a.puntuacion_tamano,
  a.puntuacion_ubicacion,
  a.puntuacion_fit_digital,
  a.score_total,
  a.puntos_dolor_detectados,
  a.analisis_final,
  a.decision,
  a.fecha_creacion,
  c.company_name,
  a.origen_lead_id::text AS source_scraping
`;

const buildFilters = (filters = {}) => {
  const clauses = [];
  const values = [];

  if (typeof filters.sourceScraping === 'number') {
    values.push(filters.sourceScraping);
    clauses.push(`a.origen_lead_id = $${values.length}`);
  }

  return {
    where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
    values
  };
};

const findAll = async (filters = {}) => {
  const { where, values } = buildFilters(filters);
  const query = `
    SELECT ${ANALISIS_LEADS_ICP_FIELDS}
    FROM analisis_leads_icp a
    LEFT JOIN companies c ON c.id = a.origen_lead_id
    ${where}
    ORDER BY a.fecha_creacion DESC NULLS LAST, a.id DESC
  `;
  const { rows } = await pool.query(query, values);
  return rows;
};

module.exports = {
  findAll
};
