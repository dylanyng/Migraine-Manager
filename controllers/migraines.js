const MigraineEvent = require('../models/MigraineEvent')

exports.getMigraineEvents = async (req, res) => {
  try {
      const migraineEvents = await MigraineEvent.find({ userId: req.user.id })
      res.render('migraines/index', { title: 'Migraine Events', user: req.user, migraineEvents: migraineEvents })
  } catch (err) {
      console.error(err)
      res.render('error', { error: err })
  }
}

exports.createMigraineEvent = async (req, res) => {
  try {
    await MigraineEvent.create({ ...req.body, userId: req.user.id })
    res.redirect('/migraines')
  } catch (err) {
      console.error(err)
      res.render('error', { error: err })
  }
}

exports.getMigraineEvent = async (req, res) => {
  try {
    const migraineEvent = await MigraineEvent.findOne({ _id: req.params.id, userId: req.user.id })
    if (!migraineEvent) {
      return res.render('error', { error: 'Migraine event not found' })
    }
    res.render('migraines/show', { title: 'Migraine Event Details', user: req.user, migraineEvent: migraineEvent })
  } catch (err) {
    console.error(err)
    res.render('error', { error: err })
  }
}

exports.updateMigraineEvent = async (req, res) => {
  try {
    const migraineEvent = await MigraineEvent.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    )
    if (!migraineEvent) {
      return res.render('error', { error: 'Migraine event not found' })
    }
    res.redirect(`/migraines/${migraineEvent._id}`)
  } catch (err) {
    console.error(err)
    res.render('error', { error: err })
  }
}

exports.deleteMigraineEvent = async (req, res) => {
  try {
    const migraineEvent = await MigraineEvent.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if (!migraineEvent) {
      return res.render('error', { error: 'Migraine event not found' })
    }
    res.redirect('/migraines')
  } catch (err) {
    console.error(err)
    res.render('error', { error: err })
  }
}