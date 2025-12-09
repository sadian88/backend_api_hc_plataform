const express = require('express');
const searchResultsController = require('../controllers/searchResults.controller');
const authGuard = require('../middlewares/authGuard');

const router = express.Router();

router.use(authGuard);

router.get('/', searchResultsController.list);
router.put('/:companyId/:linkKey', searchResultsController.update);
router.delete('/:companyId/:linkKey', searchResultsController.remove);

module.exports = router;
