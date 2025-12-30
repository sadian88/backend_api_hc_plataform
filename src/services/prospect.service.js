const prospectRepository = require('../repositories/prospect.repository');
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

const sanitizeDateTime = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date.toISOString();
};

const sanitizePayload = (payload = {}) => ({
  nombreCompleto: normalizeText(payload.nombreCompleto),
  email: normalizeText(payload.email),
  perfilLinkedin: normalizeText(payload.perfilLinkedin),
  cargo: normalizeText(payload.cargo),
  about: normalizeText(payload.about),
  location: normalizeText(payload.location),
  estado: normalizeText(payload.estado),
  fechaCreacionOrigen: sanitizeDateTime(payload.fechaCreacionOrigen),
  companyId: sanitizeNumber(payload.companyId),
  companyOrigenLead: normalizeText(payload.companyOrigenLead)
});

const sanitizeFilters = (filters = {}) => {
  const sanitized = {};
  const companyId = sanitizeNumber(filters.sourceScraping ?? filters.companyId);
  if (companyId !== null) {
    sanitized.companyId = companyId;
  }

  const originCompany = normalizeText(
    filters.companyOrigenLead ?? filters.companyOrigenLeadId ?? filters.originCompanyId
  );
  if (originCompany) {
    sanitized.companyOrigenLead = originCompany;
  }

  const estado = normalizeText(filters.estado);
  if (estado) {
    sanitized.estado = estado;
  }

  return sanitized;
};

const ensureProspect = async (id) => {
  const targetId = normalizeText(id);
  if (!targetId) {
    throw new HttpError(400, 'ID de prospecto invalido');
  }

  const existing = await prospectRepository.findById(targetId);
  if (!existing) {
    throw new HttpError(404, 'Prospecto no encontrado');
  }

  return { targetId, existing };
};

const listProspects = async (filters = {}) => {
  const sanitizedFilters = sanitizeFilters(filters);
  return prospectRepository.findAll(sanitizedFilters);
};

const updateProspect = async (id, payload = {}) => {
  const { targetId } = await ensureProspect(id);
  const data = sanitizePayload(payload);

  if (!data.nombreCompleto) {
    throw new HttpError(400, 'El nombre es obligatorio');
  }

  await prospectRepository.updateProspect(targetId, data);
  return prospectRepository.findById(targetId);
};

const deleteProspect = async (id) => {
  const { targetId } = await ensureProspect(id);
  await prospectRepository.deleteProspect(targetId);
};

module.exports = {
  listProspects,
  updateProspect,
  deleteProspect
};
