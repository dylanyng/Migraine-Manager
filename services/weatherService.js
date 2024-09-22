// Dynamic import of node-fetch
let fetch;
(async () => {
  fetch = (await import('node-fetch')).default;
})();

const BASE_URL = process.env.WEATHER_API_BASE_URL;
const API_KEY = process.env.WEATHER_API_KEY;

async function getWeatherData(location) {
  try {
    let url;
    if (typeof location === 'object' && 'latitude' in location && 'longitude' in location) {
      // Use latitude and longitude
      url = `${BASE_URL}lat=${location.latitude}&lon=${location.longitude}&key=${API_KEY}`;
    } else if (typeof location === 'string') {
      // Use city,state format
      url = `${BASE_URL}city=${encodeURIComponent(location)}&key=${API_KEY}`;
    } else {
      throw new Error('Invalid location format');
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    return {
      conditions: data.data[0].weather.description,
      humidity: data.data[0].rh,
      pressure: data.data[0].pres,
      temperature: data.data[0].temp
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

module.exports = { getWeatherData };