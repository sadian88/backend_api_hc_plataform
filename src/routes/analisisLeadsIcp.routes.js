const express = require('express');
const analisisLeadsIcpController = require('../controllers/analisisLeadsIcp.controller');
const authGuard = require('../middlewares/authGuard');

const router = express.Router();

router.use(authGuard);

router.get('/', analisisLeadsIcpController.list);

module.exports = router;
