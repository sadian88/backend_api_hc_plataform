const express = require('express');
const leadController = require('../controllers/lead.controller');
const authGuard = require('../middlewares/authGuard');

const router = express.Router();

router.use(authGuard);

router.get('/', leadController.list);
router.put('/:id', leadController.update);
router.delete('/:id', leadController.remove);

module.exports = router;
