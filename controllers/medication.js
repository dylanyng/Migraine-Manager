const MigraineEvent = require('../models/MigraineEvent');

exports.getPastMedications = async (req, res) => {
    try {
        const events = await MigraineEvent.find({ userId: req.user.id });
        const medications = new Set();
        events.forEach(event => {
            if (event.medications && event.medications.length > 0) {
                event.medications.forEach(med => {
                    medications.add(JSON.stringify({
                        name: med.name,
                        dose: med.dose,
                        quantity: med.quantity
                    }));
                });
            }
        });
        const uniqueMedications = Array.from(medications).map(med => JSON.parse(med));
        res.json(uniqueMedications);
    } catch (err) {
        console.error('Error fetching past medications:', err);
        res.status(500).json({ error: 'An error occurred while fetching past medications' });
    }
};