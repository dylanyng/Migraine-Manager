const MigraineEvent = require('../models/MigraineEvent');
const getWeather = require('../services/weatherService');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

// Convert date to UTC
function convertToUTC(dateString, timezone) {
  const dateInUserTimezone = dayjs.tz(`${dateString} 00:00:00`, timezone)
  return dateInUserTimezone.utc().toDate(); // Convert to Date object for MongoDB
}

function formatInUserTimezone(date, timezone) {
  // MM-DD-YYYY formatting
  return dayjs(date).tz(timezone).format('MM-DD-YYYY');
}

// Convert celsius to fahrenheit and round to the nearest whole number
function toFahrenheit(c) {
  let f = Number(c) * 1.8 + 32;
  return Math.round(f);
}

// Convert pressure from hPa to inHg and round to nearest hundredth
function convertPressure(hPa) {
  let inHg = hPa * 0.02952998;
  return Math.round(inHg * 100) / 100;
}

exports.getMigraineEvents = async (req, res, next) => {
  try {
    const migraineEvents = await MigraineEvent.find({ userId: req.user.id }).sort({ date: -1 })
    const userTimezone = req.user.preferences.timezone || 'UTC';

    const formattedEvents = migraineEvents.map(event => {
      const formattedDate = formatInUserTimezone(event.date, userTimezone);
      const eventObject = event.toObject();
          
      // Extract weather data
      const weather = eventObject.weather ? {
        conditions: eventObject.weather.conditions,
        humidity: eventObject.weather.humidity,
        pressure: convertPressure(eventObject.weather.pressure),
        temperature: toFahrenheit(eventObject.weather.temperature)
      } : null;
      
      return {
        ...eventObject,
        formattedDate,
        weather // Include the weather data in the formatted event
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

    let weatherData = null;
    if (req.body.weather) {
      weatherData = {
        conditions: req.body.weather.conditions,
        humidity: req.body.weather.humidity,
        pressure: req.body.weather.pressure,
        temperature: req.body.weather.temperature
      };
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
    return next(err);
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
    if (migraineEvent.weather?.temperature) {
      migraineEvent.weather.temperature = toFahrenheit(migraineEvent.weather.temperature)
    }
    if (migraineEvent.weather?.pressure) {
      migraineEvent.weather.pressure = convertPressure(migraineEvent.weather.pressure)
    }
    res.render('migraines/show', { 
      title: 'Migraine Event Details', 
      user: req.user, 
      migraineEvent: migraineEvent,
    })
  } catch (err) {
    console.error(err)
    req.flash('error', 'An error occurred while retrieving the migraine event.')
    return next(err);
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
    return next(err);
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

// CSV Export
exports.exportMigrainesCSV = async (req, res, next) => {
  try {
    const migraineEvents = await MigraineEvent.find({ userId: req.user.id }).sort({ date: 1 });
    const userTimezone = req.user.preferences.timezone || 'UTC';

    // Define CSV headers
    const headers = [
      'Date',
      'Attack Type',
      'Pain Level',
      'Pain Location',
      //'Duration (minutes)',
      'Start Location',
      'Medication',
      'Medications List',
      'Triggers',
      'Weather Conditions',
      'Weather Humidity',
      'Weather Pressure (hPa)',
      'Weather Temperature (°C)',
      'Notes',
      'Quick Log',
      'Created At',
      'Updated At'
    ];

    // Helper function to escape CSV fields
    const escapeCSV = (field) => {
      if (field === null || field === undefined) return '';
      const str = String(field);
      // If field contains comma, quote, or newline, wrap in quotes and escape quotes
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Helper function to format date in user's timezone
    const formatDateForCSV = (date) => {
      if (!date) return '';
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: userTimezone
      };
      return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
    };

    // Convert events to CSV rows
    const csvRows = migraineEvents.map(event => {
      const eventObj = event.toObject();
      
      // Format date in user's timezone
      const formattedDate = formatDateForCSV(eventObj.date);
      
      // Convert pressure from hPa to inHg for CSV (or keep original)
      const pressure = eventObj.weather?.pressure ? 
        (Math.round((eventObj.weather.pressure * 0.02952998) * 100) / 100) : '';
      
      // Convert temperature from Celsius to Fahrenheit
      const tempC = eventObj.weather?.temperature || '';
      const tempF = tempC ? (Math.round(toFahrenheit(tempC) * 100) / 100) : '';
      
      // Format arrays as comma-separated strings
      const painLocation = Array.isArray(eventObj.painLocation) ? 
        eventObj.painLocation.join('; ') : '';
      const startLocation = Array.isArray(eventObj.startLocation) ? 
        eventObj.startLocation.join('; ') : '';
      const triggers = Array.isArray(eventObj.triggers) ? 
        eventObj.triggers.join('; ') : '';
      
      // Format medications array
      const medicationsList = Array.isArray(eventObj.medications) && eventObj.medications.length > 0 ?
        eventObj.medications.map(med => 
          `${med.name || ''}${med.dose ? ` (${med.dose})` : ''}${med.quantity ? ` x${med.quantity}` : ''}`
        ).join('; ') : '';
      
      return [
        escapeCSV(formattedDate),
        escapeCSV(eventObj.attackType || ''),
        escapeCSV(eventObj.painLevel !== undefined ? eventObj.painLevel : ''),
        escapeCSV(painLocation),
        //escapeCSV(eventObj.duration || ''),
        escapeCSV(startLocation),
        escapeCSV(eventObj.medication ? 'Yes' : 'No'),
        escapeCSV(medicationsList),
        escapeCSV(triggers),
        escapeCSV(eventObj.weather?.conditions || ''),
        escapeCSV(eventObj.weather?.humidity || ''),
        escapeCSV(pressure),
        escapeCSV(tempC ? `${tempC}C (${tempF}F)` : ''),
        escapeCSV(eventObj.notes || ''),
        escapeCSV(eventObj.quickLog ? 'Yes' : 'No'),
        escapeCSV(formatDateForCSV(eventObj.createdAt)),
        escapeCSV(formatDateForCSV(eventObj.updatedAt))
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Set response headers for CSV download
    const filename = `migraine-data-export-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Send CSV content
    res.send(csvContent);
  } catch (err) {
    console.error(err);
    req.flash('error', 'An error occurred while exporting migraine data.');
    next(err);
  }
};

// Charts
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