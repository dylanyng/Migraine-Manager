const MigraineEvent = require('../models/MigraineEvent')
const getWeather = require('../services/weatherService')

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
      const migraineEvents = await MigraineEvent.find({ userId: req.user.id }).sort({ date: -1 })
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

    // Parse medications from JSON string to array of objects
    if (req.body.medications) {
      req.body.medications = JSON.parse(req.body.medications);
    } else {
      req.body.medications = [];
    }

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
      req.body.date = convertToUTC(req.body.date, userTimezone);
    }

    const weatherData = {
      conditions: req.body.weather.conditions,
      humidity: req.body.weather.humidity,
      pressure: req.body.weather.pressure,
      temperature: req.body.weather.temperature
    }

    console.log(weatherData);

    await MigraineEvent.create({ 
      ...req.body, 
      weather: weatherData, 
      userId: req.user.id 
    })

    req.flash('success', 'Migraine event recorded successfully');
    res.redirect('/migraines');
  } catch (err) {
    console.error(err);
    next(err);
    req.flash('error', 'An error occurred while recording the migraine event');
    res.redirect('/migraines/new');
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
    if (migraineEvent.triggers && migraineEvent.triggers.length > 0) {
      // Insert space after each comma in trigger list
      migraineEvent.triggers = migraineEvent.triggers.map(trigger => ` ${trigger}`);
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
    // Convert medication checkbox value to boolean
    req.body.medication = req.body.medication === 'on';

    // Parse medications from JSON string to array of objects
    if (req.body.medications) {
      req.body.medications = JSON.parse(req.body.medications);
    } else {
      req.body.medications = [];
    }

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

exports.getVisualizations = async (req, res) => {
  try {
    const attackTypes = await MigraineEvent.aggregate([
      { $match: { userId: req.user.id } },
      { $group: { _id: '$attackType', count: { $sum: 1 } } }
    ]);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyAttacks = await MigraineEvent.aggregate([
      { 
        $match: { 
          userId: req.user.id,
          date: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: {
            yearMonth: { $dateToString: { format: "%Y-%m", date: "$date" } },
            attackType: "$attackType"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.yearMonth",
          attackTypes: {
            $push: {
              type: "$_id.attackType",
              count: "$count"
            }
          }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 1,
          migraine: {
            $ifNull: [
              { $arrayElemAt: [{ $filter: { input: "$attackTypes", as: "type", cond: { $eq: ["$$type.type", "migraine"] } } }, 0] },
              { type: "migraine", count: 0 }
            ]
          },
          headache: {
            $ifNull: [
              { $arrayElemAt: [{ $filter: { input: "$attackTypes", as: "type", cond: { $eq: ["$$type.type", "headache"] } } }, 0] },
              { type: "headache", count: 0 }
            ]
          },
          miscSymptoms: {
            $ifNull: [
              { $arrayElemAt: [{ $filter: { input: "$attackTypes", as: "type", cond: { $eq: ["$$type.type", "misc symptoms"] } } }, 0] },
              { type: "misc symptoms", count: 0 }
            ]
          }
        }
      },
      {
        $project: {
          _id: 1,
          migraine: "$migraine.count",
          headache: "$headache.count",
          miscSymptoms: "$miscSymptoms.count"
        }
      }
    ]);

    const topTriggers = await MigraineEvent.aggregate([
      { $match: { userId: req.user.id } },
      { $unwind: '$triggers' },
      { $match: { 'triggers': { $ne: '' } } }, // Ignoring no trigger entries
      { $group: { _id: '$triggers', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 } 
    ]);


    const medicationData = await MigraineEvent.aggregate([
      {
        $match: {
          userId: req.user.id,
          date: { $gte: sixMonthsAgo },
          'medications.name': { $exists: true, $ne: '' }
        }
      },
      {
        $unwind: '$medications'
      },
      {
        $group: {
          _id: {
            yearMonth: { $dateToString: { format: "%Y-%m", date: "$date" } },
            medication: '$medications.name'
          },
          totalQuantity: { $sum: '$medications.quantity' }
        }
      },
      {
        $sort: { totalQuantity: -1 }
      },
      {
        $group: {
          _id: '$_id.yearMonth',
          medications: {
            $push: {
              name: '$_id.medication',
              quantity: '$totalQuantity'
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          medications: { $slice: ['$medications', 3] }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // New query for pain location pie chart
    const painLocationData = await MigraineEvent.aggregate([
      {
        $match: { userId: req.user.id }
      },
      {
        $unwind: '$painLocation'
      },
      {
        $group: {
          _id: '$painLocation',
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gt: 0 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.render('migraines/visualizations', {
      title: 'Migraine Visualizations',
      user: req.user,
      attackTypes,
      monthlyAttacks,
      topTriggers,
      medicationData,
      painLocationData
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { 
      error: err,
      message: 'An error occurred while retrieving visualization data.'
    });
  }
};