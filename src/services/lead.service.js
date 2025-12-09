const leadRepository = require('../repositories/lead.repository');
const HttpError = require('../utils/httpError');

const normalizeText = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  const text = String(value).trim();
  return text.length ? text : null;
};

const sanitizeNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const sanitizeArray = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item || '').trim()).filter((item) => item.length);
  }

  if (typeof value === 'string') {
    return value
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter((item) => item.length);
  }

  return [];
};

const sanitizePayload = (payload) => ({
  companyId: sanitizeNumber(payload.companyId),
  nombre: normalizeText(payload.nombre),
  cargo: normalizeText(payload.cargo),
  seniority: normalizeText(payload.seniority),
  rolFuncional: normalizeText(payload.rolFuncional),
  empresa: normalizeText(payload.empresa),
  sectorEmpresa: normalizeText(payload.sectorEmpresa),
  pais: normalizeText(payload.pais),
  ciudad: normalizeText(payload.ciudad),
  tamanoEmpresaEmpleados: sanitizeNumber(payload.tamanoEmpresaEmpleados),
  headlinePerfil: normalizeText(payload.headlinePerfil),
  resumenPerfil: normalizeText(payload.resumenPerfil),
  temasClavePublicaciones: sanitizeArray(payload.temasClavePublicaciones),
  ultimasPublicacionesTexto: sanitizeArray(payload.ultimasPublicacionesTexto),
  interaccionesRelevantes: sanitizeArray(payload.interaccionesRelevantes),
  tagsInternos: sanitizeArray(payload.tagsInternos),
  linkedinUrl: normalizeText(payload.linkedinUrl)
});

const listLeads = async () => {
  return leadRepository.findAll();
};

const updateLead = async (id, payload) => {
  const targetId = normalizeText(id);
  if (!targetId) {
    throw new HttpError(400, 'ID de lead invalido');
  }

  const existing = await leadRepository.findById(targetId);
  if (!existing) {
    throw new HttpError(404, 'Lead no encontrado');
  }

  const data = sanitizePayload(payload);
  if (!data.nombre) {
    throw new HttpError(400, 'El nombre es obligatorio');
  }

  await leadRepository.updateLead(targetId, data);
  return leadRepository.findById(targetId);
};

const deleteLead = async (id) => {
  const targetId = normalizeText(id);
  if (!targetId) {
    throw new HttpError(400, 'ID de lead invalido');
  }

  const existing = await leadRepository.findById(targetId);
  if (!existing) {
    throw new HttpError(404, 'Lead no encontrado');
  }

  await leadRepository.deleteLead(targetId);
};

module.exports = {
  listLeads,
  updateLead,
  deleteLead
};
