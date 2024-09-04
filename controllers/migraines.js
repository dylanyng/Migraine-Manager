const MigraineEvent = require('../models/MigraineEvent')

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  let result = '';
  if (hours > 0) {
    result += `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  if (remainingMinutes > 0) {
    if (result) result += ' ';
    result += `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
  }
  return result || 'Less than a minute';
}

exports.getMigraineEvents = async (req, res) => {
  try {
      const migraineEvents = await MigraineEvent.find({ userId: req.user.id })
      res.render('migraines/index', { 
        title: 'Migraine Events', 
        user: req.user, 
        migraineEvents: migraineEvents 
      })
  } catch (err) {
      console.error(err)
      req.flash('error', 'An error occurred while retrieving migraine events.')
      res.redirect('/')
  }
}

exports.getMigraineForm = (req, res) => {
  try {
    res.render('migraines/new', {
      title: 'Record New Migraine Event',
      user: req.user,
      layout: 'layout'
    })
  } catch (err) {
    console.error(err)
    req.flash('error', 'An error occurred while loading the form.')
    res.redirect('/migraines')
  }
}

exports.createMigraineEvent = async (req, res) => {
  try {
    // Convert medication checkbox value to boolean
    req.body.medication = req.body.medication === 'on';

    // If medication is not checked, set medications to an empty array
    if (!req.body.medication) {
      req.body.medications = [];
    }

    // Convert painLocation to an array if it's not already
    if (typeof req.body.painLocation === 'string') {
      req.body.painLocation = [req.body.painLocation];
    }

    // Convert triggers to an array if it's not already
    if (typeof req.body.triggers === 'string') {
      req.body.triggers = req.body.triggers.split(',').map(item => item.trim());
    }

    await MigraineEvent.create({ ...req.body, userId: req.user.id })
    req.flash('success', 'Migraine event recorded successfully')
    res.redirect('/migraines')
  } catch (err) {
      console.error(err)
      req.flash('error', 'An error occurred while recording the migraine event')
      res.redirect('/migraines/new')
      // res.render('error', { error: err })
  }
}

exports.getMigraineEvent = async (req, res) => {
  try {
    const migraineEvent = await MigraineEvent.findOne({   
      _id: req.params.id, 
      userId: req.user.id 
    })
    if (!migraineEvent) {
      return res.render('error', { error: 'Migraine event not found' })
    }
    res.render('migraines/show', { 
      title: 'Migraine Event Details', 
      user: req.user, 
      migraineEvent: migraineEvent,
      formatDuration: formatDuration
    })
  } catch (err) {
    console.error(err)
    req.flash('error', 'An error occurred while retrieving the migraine event.')
    res.redirect('/migraines')
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
    const migraineEvent = await MigraineEvent.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    })
    if (!migraineEvent) {
      return res.render('error', { error: 'Migraine event not found' })
    }
    req.flash('success', 'Migraine event deleted successfully')
    res.redirect('/migraines')
  } catch (err) {
    console.error(err)
    req.flash('error', 'An error occurred while deleting the migraine event')
    res.redirect('/migraines')
  }
}