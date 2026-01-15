const analisisLeadsIcpRepository = require('../repositories/analisisLeadsIcp.repository');

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

const listAnalisisLeadsIcp = async (filters = {}) => {
  const sanitizedFilters = sanitizeFilters(filters);
  return analisisLeadsIcpRepository.findAll(sanitizedFilters);
};

module.exports = {
  listAnalisisLeadsIcp
};
