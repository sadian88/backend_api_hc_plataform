const pool = require('../db/pool');

const LEAD_FIELDS = `
  l.id_lead,
  l.company_id,
  l.nombre,
  l.cargo,
  l.seniority,
  l.rol_funcional,
  l.empresa,
  l.sector_empresa,
  l.pais,
  l.ciudad,
  l.tamano_empresa_empleados,
  l.headline_perfil,
  l.resumen_perfil,
  l.temas_clave_publicaciones,
  l.ultimas_publicaciones_texto,
  l.interacciones_relevantes,
  l.tags_internos,
  l.created_at,
  l.updated_at,
  l.linkedin_url,
  c.company_name AS company_name
`;

const findAll = async () => {
  const query = `
    SELECT ${LEAD_FIELDS}
    FROM leads l
    LEFT JOIN companies c ON c.id = l.company_id
    ORDER BY l.updated_at DESC, l.nombre ASC
  `;
  const { rows } = await pool.query(query);
  return rows;
};

const findById = async (id) => {
  const query = `
    SELECT ${LEAD_FIELDS}
    FROM leads l
    LEFT JOIN companies c ON c.id = l.company_id
    WHERE l.id_lead = $1
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

const updateLead = async (id, payload) => {
  const query = `
    UPDATE leads
    SET
      company_id = $1,
      nombre = $2,
      cargo = $3,
      seniority = $4,
      rol_funcional = $5,
      empresa = $6,
      sector_empresa = $7,
      pais = $8,
      ciudad = $9,
      tamano_empresa_empleados = $10,
      headline_perfil = $11,
      resumen_perfil = $12,
      temas_clave_publicaciones = $13,
      ultimas_publicaciones_texto = $14,
      interacciones_relevantes = $15,
      tags_internos = $16,
      linkedin_url = $17,
      updated_at = NOW()
    WHERE id_lead = $18
    RETURNING id_lead
  `;

  const values = [
    payload.companyId,
    payload.nombre,
    payload.cargo,
    payload.seniority,
    payload.rolFuncional,
    payload.empresa,
    payload.sectorEmpresa,
    payload.pais,
    payload.ciudad,
    payload.tamanoEmpresaEmpleados,
    payload.headlinePerfil,
    payload.resumenPerfil,
    payload.temasClavePublicaciones,
    payload.ultimasPublicacionesTexto,
    payload.interaccionesRelevantes,
    payload.tagsInternos,
    payload.linkedinUrl,
    id
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteLead = async (id) => {
  await pool.query('DELETE FROM leads WHERE id_lead = $1', [id]);
};

module.exports = {
  findAll,
  findById,
  updateLead,
  deleteLead
};
