const express = require('express');
const authRoutes = require('./auth.routes');
const companyRoutes = require('./companies.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/companies', companyRoutes);

module.exports = router;
