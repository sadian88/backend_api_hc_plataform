const searchResultsRepository = require('../repositories/searchResults.repository');
const HttpError = require('../utils/httpError');

const encodeLinkKey = (link) => Buffer.from(link, 'utf8').toString('base64url');

const decodeLinkKey = (linkKey) => {
  try {
    return Buffer.from(linkKey, 'base64url').toString('utf8');
  } catch (error) {
    throw new HttpError(400, 'Identificador de resultado invalido');
  }
};

const formatRow = (row) => ({
  ...row,
  link_key: encodeLinkKey(row.link)
});

const normalizeText = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  const text = String(value).trim();
  return text.length ? text : null;
};

const sanitizePayload = (payload) => ({
  title: normalizeText(payload.title),
  redirectLink: normalizeText(payload.redirectLink),
  displayedLink: normalizeText(payload.displayedLink),
  source: normalizeText(payload.source)
});

const sanitizeFilters = (filters = {}) => {
  const sourceScrapingValue = filters.sourceScraping;
  if (sourceScrapingValue === null || sourceScrapingValue === undefined || sourceScrapingValue === '') {
    return {};
  }

  const parsed = Number(sourceScrapingValue);
  if (Number.isNaN(parsed)) {
    return {};
  }

  return { sourceScraping: parsed };
};

const listResults = async (filters = {}) => {
  const sanitizedFilters = sanitizeFilters(filters);
  const rows = await searchResultsRepository.findAll(sanitizedFilters);
  return rows.map(formatRow);
};

const updateResult = async (companyIdParam, linkKey, payload) => {
  const companyId = Number(companyIdParam);
  if (Number.isNaN(companyId)) {
    throw new HttpError(400, 'companyId invalido');
  }

  const link = decodeLinkKey(linkKey);
  const existing = await searchResultsRepository.findByComposite(companyId, link);
  if (!existing) {
    throw new HttpError(404, 'Resultado no encontrado');
  }

  const data = sanitizePayload(payload || {});
  const updated = await searchResultsRepository.updateEntry(companyId, link, data);
  return formatRow(updated);
};

const deleteResult = async (companyIdParam, linkKey) => {
  const companyId = Number(companyIdParam);
  if (Number.isNaN(companyId)) {
    throw new HttpError(400, 'companyId invalido');
  }

  const link = decodeLinkKey(linkKey);
  const existing = await searchResultsRepository.findByComposite(companyId, link);
  if (!existing) {
    throw new HttpError(404, 'Resultado no encontrado');
  }

  await searchResultsRepository.deleteEntry(companyId, link);
};

module.exports = {
  listResults,
  updateResult,
  deleteResult
};
