const companyRepository = require('../repositories/company.repository');
const HttpError = require('../utils/httpError');

const sanitizePayload = (payload) => ({
  companyName: String(payload.companyName || '').trim(),
  companyUrlProfile: String(payload.companyUrlProfile || '').trim(),
  companySegment: payload.companySegment ? String(payload.companySegment).trim() : null,
  customerUrlProfile: payload.customerUrlProfile
    ? String(payload.customerUrlProfile).trim()
    : null,
  companyIcp: payload.companyIcp ? String(payload.companyIcp).trim() : null,
  creationDate: payload.creationDate || null
});

const listCompanies = async () => {
  return companyRepository.findAll();
};

const createCompany = async (payload) => {
  const data = sanitizePayload(payload);
  if (!data.companyName || !data.companyUrlProfile) {
    throw new HttpError(400, 'companyName y companyUrlProfile son obligatorios');
  }

  return companyRepository.createCompany(data);
};

const updateCompany = async (id, payload) => {
  const targetId = Number(id);
  if (Number.isNaN(targetId)) {
    throw new HttpError(400, 'ID inválido');
  }

  const existing = await companyRepository.findById(targetId);
  if (!existing) {
    throw new HttpError(404, 'Compañía no encontrada');
  }

  const data = sanitizePayload(payload);
  if (!data.companyName || !data.companyUrlProfile) {
    throw new HttpError(400, 'companyName y companyUrlProfile son obligatorios');
  }

  return companyRepository.updateCompany(targetId, data);
};

const deleteCompany = async (id) => {
  const targetId = Number(id);
  if (Number.isNaN(targetId)) {
    throw new HttpError(400, 'ID inválido');
  }

  const existing = await companyRepository.findById(targetId);
  if (!existing) {
    throw new HttpError(404, 'Compañía no encontrada');
  }

  await companyRepository.deleteCompany(targetId);
};

module.exports = {
  listCompanies,
  createCompany,
  updateCompany,
  deleteCompany
};
