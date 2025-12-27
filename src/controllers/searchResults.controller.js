const searchResultsService = require('../services/searchResults.service');

const list = async (req, res, next) => {
  try {
    const results = await searchResultsService.listResults({
      sourceScraping: req.query.sourceScraping
    });
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await searchResultsService.updateResult(
      req.params.companyId,
      req.params.linkKey,
      req.body || {}
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await searchResultsService.deleteResult(req.params.companyId, req.params.linkKey);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  list,
  update,
  remove
};
