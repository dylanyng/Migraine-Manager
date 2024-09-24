const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');

router.get('/', async (req, res) => {
    const { latitude, longitude, zipCode } = req.query;
    try {
        let weatherData;
        if (latitude && longitude) {
            weatherData = await weatherService.getWeatherData({ latitude, longitude });
        } else if (zipCode) {
            weatherData = await weatherService.getWeatherData({ zipCode });
        } else {
            return res.status(400).json({ error: 'Missing location data' });
        }
        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Unable to fetch weather data' });
    }
});

module.exports = router;