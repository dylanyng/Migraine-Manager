const MigraineEvent = require('../models/MigraineEvent')

// Convert date to UTC
function convertToUTC(dateString, timezone) {
  const date = new Date(dateString);
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  return utcDate;
}

// Format date in user's timezone
function formatInUserTimezone(date, timezone) {
  // MM-DD-YYYY formatting
  const options = { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    timeZone: timezone 
  };
  const formatted = new Intl.DateTimeFormat('en-US', options).format(date);
  return formatted;
}

// Format migraine duration time
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

exports.getMigraineEvents = async (req, res, next) => {
  try {
      const migraineEvents = await MigraineEvent.find({ userId: req.user.id })
      const userTimezone = req.user.preferences.timezone || 'UTC';

      const formattedEvents = migraineEvents.map(event => {
        const formattedDate = formatInUserTimezone(event.date, userTimezone);
        return {
          ...event.toObject(),
          formattedDate
        };
      });

      res.render('migraines/index', { 
        title: 'Migraine Events', 
        user: req.user, 
        migraineEvents: formattedEvents 
      })
  } catch (err) {
      console.error(err)
      req.flash('error', 'An error occurred while retrieving migraine events.')
      next(err);
  }
}

exports.getMigraineForm = (req, res, next) => {
  try {
    res.render('migraines/new', {
      title: 'Record New Migraine Event',
      user: req.user,
      layout: 'layout'
    })
  } catch (err) {
    console.error(err)
    req.flash('error', 'An error occurred while loading the form.')
    next(err);
  }
}

exports.createMigraineEvent = async (req, res, next) => {
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

    // Convert and store the user-input date in UTC, using the user's timezone preference
    if (req.body.date) {
      const userTimezone = req.user.preferences.timezone || 'UTC';
      
      // Convert user's time zone to UTC before saving it to the database
      req.body.date = convertToUTC(req.body.date, userTimezone);
    }

    await MigraineEvent.create({ ...req.body, userId: req.user.id })
    req.flash('success', 'Migraine event recorded successfully')
    res.redirect('/migraines')
  } catch (err) {
      console.error(err)
      next(err);
      req.flash('error', 'An error occurred while recording the migraine event')
      res.redirect('/migraines/new')
  }
}

exports.getMigraineEvent = async (req, res, next) => {
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
    next(err);
  }
}

exports.getEditMigraineForm = async (req, res, next) => {
  try {
    const migraineEvent = await MigraineEvent.findOne({ _id: req.params.id, userId: req.user.id })
    if (!migraineEvent) {
      req.flash('error', 'Migraine event not found')
      return res.redirect('/migraines')
    }
    res.render('migraines/edit', { 
      title: 'Edit Migraine Event', 
      user: req.user, 
      migraineEvent: migraineEvent 
    })
  } catch (err) {
    console.error(err)
    req.flash('error', 'An error occurred while retrieving the migraine event.')
    next(err);
  }
}

exports.updateMigraineEvent = async (req, res, next) => {
  try {
    // Same logic to createMigraineEvent for handling form data
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

    // Convert and store the user-input date in UTC, using the user's timezone preference
    if (req.body.date) {
      const userTimezone = req.user.preferences.timezone || 'UTC';
      // Convert user's time zone to UTC before saving it to the database
      req.body.date = convertToUTC(req.body.date, userTimezone);
    }

    const updatedMigraineEvent = await MigraineEvent.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    )
    if (!updatedMigraineEvent) {
      req.flash('error', 'Migraine event not found')
      return res.redirect('/migraines')
    }
    req.flash('success', 'Migraine event updated successfully')
    res.redirect(`/migraines/${updatedMigraineEvent._id}`)
  } catch (err) {
    console.error(err)
    req.flash('error', 'An error occurred while updating the migraine event')
    next(err);
    res.redirect(`/migraines/${req.params.id}/edit`)
  }
}

exports.deleteMigraineEvent = async (req, res, next) => {
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
    next(err);
    req.flash('error', 'An error occurred while deleting the migraine event')
    res.redirect('/migraines')
  }
}