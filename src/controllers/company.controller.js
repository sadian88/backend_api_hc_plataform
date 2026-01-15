const companyService = require('../services/company.service');

const list = async (req, res, next) => {
  try {
    const companies = await companyService.listCompanies();
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const company = await companyService.createCompany(req.body || {});
    res.status(201).json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const company = await companyService.updateCompany(req.params.id, req.body || {});
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await companyService.deleteCompany(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const startScraping = async (req, res, next) => {
  try {
    const result = await companyService.startScraping(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  list,
  create,
  update,
  remove,
  startScraping
};
