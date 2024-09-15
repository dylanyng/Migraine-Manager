const MigraineEvent = require('../models/MigraineEvent');

exports.getPastTriggers = async (req, res) => {
    try {
        const events = await MigraineEvent.find({ userId: req.user.id });
        const triggers = new Set();
        events.forEach(event => {
            if (event.triggers) {
                event.triggers.forEach(trigger => triggers.add(trigger.toLowerCase()));
            }
        });
        res.json(Array.from(triggers));
    } catch (err) {
        console.error('Error fetching past triggers:', err);
        res.status(500).json({ error: 'An error occurred while fetching past triggers' });
    }
};