const authService = require('../services/auth.service');
const HttpError = require('../utils/httpError');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      throw new HttpError(400, 'Email y password son obligatorios');
    }

    const result = await authService.login({ email, password });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login
};
