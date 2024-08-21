const MigraineEvent = require('../models/MigraineEvent')

exports.getMigraineEvents = async (req, res) => {
  try {
    const migraineEvents = await MigraineEvent.find({ userId: req.user.id })
    res.json(migraineEvents)
  } catch (err) {
    // Sends JSON response with a 400 Bad Request status code and the error message
    // Allows the client-side to display a message to the user, and potentially take action
    res.status(400).json({ error: err.message })
  }
}

exports.createMigraineEvent = async (req, res) => {
  try {
    const migraineEvent = await MigraineEvent.create({ ...req.body, userId: req.user.id })
    res.status(201).json(migraineEvent)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.getMigraineEvent = async (req, res) => {
  try {
    const migraineEvent = await MigraineEvent.findOne({ _id: req.params.id, userId: req.user.id })
    if (!migraineEvent) {
      return res.status(404).json({ error: 'Migraine event not found' })
    }
    res.json(migraineEvent)
  } catch (err) {
    res.status(400).json({ error: err.message })
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
      return res.status(404).json({ error: 'Migraine event not found' })
    }
    res.json(migraineEvent)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.deleteMigraineEvent = async (req, res) => {
  try {
    const migraineEvent = await MigraineEvent.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if (!migraineEvent) {
      return res.status(404).json({ error: 'Migraine event not found' })
    }
    res.json({ message: 'Migraine event deleted' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}