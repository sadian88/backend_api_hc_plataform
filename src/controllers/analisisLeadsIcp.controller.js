const analisisLeadsIcpService = require('../services/analisisLeadsIcp.service');

const list = async (req, res, next) => {
  try {
    const results = await analisisLeadsIcpService.listAnalisisLeadsIcp({
      sourceScraping: req.query.sourceScraping
    });
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  list
};
