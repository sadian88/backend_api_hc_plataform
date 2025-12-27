const prospectService = require('../services/prospect.service');

const list = async (req, res, next) => {
  try {
    const prospects = await prospectService.listProspects({
      sourceScraping: req.query.sourceScraping,
      companyOrigenLeadId: req.query.companyOrigenLeadId,
      estado: req.query.estado
    });
    res.status(200).json({ success: true, data: prospects });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const prospect = await prospectService.updateProspect(req.params.id, req.body || {});
    res.status(200).json({ success: true, data: prospect });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await prospectService.deleteProspect(req.params.id);
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
