const express = require('express');
const companyController = require('../controllers/company.controller');
const authGuard = require('../middlewares/authGuard');

const router = express.Router();

router.use(authGuard);

router.get('/', companyController.list);
router.post('/', companyController.create);
router.put('/:id', companyController.update);
router.post('/:id/scraping', companyController.startScraping);
router.delete('/:id', companyController.remove);

module.exports = router;
