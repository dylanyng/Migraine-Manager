const fetch = require('node-fetch');
const API_KEY = process.env.WEATHER_API_KEY;
const BASE_KEY = process.env.WEATHER_API_BASE_URL;

// async function to get weather data