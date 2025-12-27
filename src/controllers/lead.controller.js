const leadService = require('../services/lead.service');

const list = async (req, res, next) => {
  try {
    const leads = await leadService.listLeads({
      sourceScraping: req.query.sourceScraping
    });
    res.status(200).json({ success: true, data: leads });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const lead = await leadService.updateLead(req.params.id, req.body || {});
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await leadService.deleteLead(req.params.id);
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
