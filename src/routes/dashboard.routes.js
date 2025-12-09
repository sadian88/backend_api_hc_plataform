const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authGuard = require('../middlewares/authGuard');

const router = express.Router();

router.use(authGuard);

router.get('/', dashboardController.getDashboard);

module.exports = router;
