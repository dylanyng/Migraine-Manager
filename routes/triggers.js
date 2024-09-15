const express = require('express');
const router = express.Router();
const triggersController = require('../controllers/triggers');
const { ensureAuth } = require('../middleware/auth');

router.get('/past-triggers', ensureAuth, triggersController.getPastTriggers);

module.exports = router;