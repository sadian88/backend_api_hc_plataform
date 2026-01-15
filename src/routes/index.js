const express = require('express');
const authRoutes = require('./auth.routes');
const companyRoutes = require('./companies.routes');
const leadRoutes = require('./leads.routes');
const searchResultsRoutes = require('./searchResults.routes');
const dashboardRoutes = require('./dashboard.routes');
const prospectRoutes = require('./prospects.routes');
const analisisLeadsIcpRoutes = require('./analisisLeadsIcp.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/companies', companyRoutes);
router.use('/leads', leadRoutes);
router.use('/search-results', searchResultsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/prospects', prospectRoutes);
router.use('/analisis-leads-icp', analisisLeadsIcpRoutes);

module.exports = router;
