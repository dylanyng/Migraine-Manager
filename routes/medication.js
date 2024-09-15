const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medication');
const { ensureAuth } = require('../middleware/auth');

router.get('/past-medications', ensureAuth, medicationController.getPastMedications);

module.exports = router;