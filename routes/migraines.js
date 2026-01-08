const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const migraineController = require('../controllers/migraines')

router.get('/visualizations', ensureAuth, migraineController.getVisualizations);
router.get('/export', ensureAuth, (req, res, next) => migraineController.exportMigrainesCSV(req, res, next));

router.get('/', ensureAuth, (req, res, next) => migraineController.getMigraineEvents(req, res, next));
router.get('/index', ensureAuth, (req, res, next) => migraineController.getMigraineEvents(req, res, next));
router.get('/new', ensureAuth, (req, res, next) => migraineController.getMigraineForm(req, res, next));
router.post('/', ensureAuth, (req, res, next) => migraineController.createMigraineEvent(req, res, next));
router.get('/:id', ensureAuth, (req, res, next) => migraineController.getMigraineEvent(req, res, next));
router.put('/:id', ensureAuth, (req, res, next) => migraineController.updateMigraineEvent(req, res, next));
router.get('/edit/:id', ensureAuth, (req, res, next) => migraineController.getEditMigraineForm(req, res, next));
router.delete('/delete/:id', ensureAuth, (req, res, next) => migraineController.deleteMigraineEvent(req, res, next));

module.exports = router