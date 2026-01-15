const https = require('https');
const { URL } = require('url');
const companyRepository = require('../repositories/company.repository');
const HttpError = require('../utils/httpError');
const env = require('../config/env');

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

const postJson = (url, payload) =>
  new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const data = JSON.stringify(payload);
    const options = {
      method: 'POST',
      hostname: parsed.hostname,
      path: `${parsed.pathname}${parsed.search}`,
      port: parsed.port || 443,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const request = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode || 500, body });
      });
    });

    request.on('error', (error) => reject(error));
    request.write(data);
    request.end();
  });

const sanitizePayload = (payload) => ({
  companyName: String(payload.companyName || '').trim(),
  companyUrlProfile: String(payload.companyUrlProfile || '').trim(),
  companySegment: normalizeText(payload.companySegment),
  customerUrlProfile: normalizeText(payload.customerUrlProfile),
  companyIcp: normalizeText(payload.companyIcp),
  icpIndustries: sanitizeArray(payload.icpIndustries),
  icpCompanySize: normalizeText(payload.icpCompanySize),
  icpTargetCountry: normalizeText(payload.icpTargetCountry),
  icpTargetCity: normalizeText(payload.icpTargetCity),
  icpIndustryPain: normalizeText(payload.icpIndustryPain),
  icpCompetitors: sanitizeArray(payload.icpCompetitors),
  icpCurrentCustomers: sanitizeArray(payload.icpCurrentCustomers),
  buyerPersonaName: normalizeText(payload.buyerPersonaName),
  buyerPersonaAge: sanitizeNumber(payload.buyerPersonaAge),
  buyerPersonaRole: normalizeText(payload.buyerPersonaRole),
  buyerPersonaCompanyType: normalizeText(payload.buyerPersonaCompanyType),
  buyerPersonaLocation: normalizeText(payload.buyerPersonaLocation),
  buyerPersonaGoals: normalizeText(payload.buyerPersonaGoals),
  buyerPersonaPainPoints: normalizeText(payload.buyerPersonaPainPoints),
  buyerPersonaBuyingBehavior: normalizeText(payload.buyerPersonaBuyingBehavior),
  buyerPersonaChannels: sanitizeArray(payload.buyerPersonaChannels),
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

const startScraping = async (id) => {
  const targetId = Number(id);
  if (Number.isNaN(targetId)) {
    throw new HttpError(400, 'ID invalido');
  }

  const existing = await companyRepository.findById(targetId);
  if (!existing) {
    throw new HttpError(404, 'Compania no encontrada');
  }

  const { status } = await postJson(env.scrapingWebhookUrl, { company_id: targetId });
  if (status < 200 || status >= 300) {
    throw new HttpError(502, 'No se pudo iniciar el scraping');
  }

  return { status };
};

module.exports = {
  listCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  startScraping
};
