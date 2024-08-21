const express = require('express')
const router = express.Router()
const migraineController = require('../controllers/migraines')
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, migraineController.getMigraineEvents)
router.post('/', ensureAuth, migraineController.createMigraineEvent)
router.get('/:id', ensureAuth, migraineController.getMigraineEvent)
router.put('/:id', ensureAuth, migraineController.updateMigraineEvent)
router.delete('/:id', ensureAuth, migraineController.deleteMigraineEvent)

module.exports = router