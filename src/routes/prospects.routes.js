const express = require('express');
const prospectController = require('../controllers/prospect.controller');
const authGuard = require('../middlewares/authGuard');

const router = express.Router();

router.use(authGuard);

router.get('/', prospectController.list);
router.put('/:id', prospectController.update);
router.delete('/:id', prospectController.remove);

module.exports = router;
