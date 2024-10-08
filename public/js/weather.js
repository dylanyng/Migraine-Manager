document.addEventListener('DOMContentLoaded', function() {
    const getLocationWeatherBtn = document.getElementById('getLocationWeather');
    const zipCodeInput = document.getElementById('zipCode');
    const weatherDataDisplay = document.getElementById('weatherDataDisplay');
    const weatherInfo = document.getElementById('weatherInfo');

    // Convert celsius to fahrenheit
    function toFahrenheit(c) {
        return Number(c) * 1.8 + 32;
    }

    // Convert hPa from weatherbit to inHg, to display to the user
    function convertPressure(hPa) {
        let inHg = hPa * 0.02952998;
        return Math.round(inHg * 100) / 100;
      }
    
    getLocationWeatherBtn.addEventListener('click', function() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                fetchWeatherData({ latitude, longitude });
            }, function(error) {
                console.error("Error: " + error.message);
                alert("Unable to retrieve your location. Please ensure location services are enabled or use zip code.");
            });
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    });

    zipCodeInput.addEventListener('change', function() {
        const zipCode = this.value;
        if (zipCode) {
            fetchWeatherData({ zipCode });
        }
    });

    function fetchWeatherData(data) {
        const queryString = new URLSearchParams(data).toString();
        fetch(`/weather?${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to fetch weather data. Please try again.');
        });
    }

    function displayWeatherData(data) {
        weatherInfo.innerHTML = `
            <p>Temperature: ${toFahrenheit(data.temperature)}°F</p>
            <p>Conditions: ${data.conditions}</p>
            <p>Humidity: ${data.humidity}%</p>
            <p>Pressure: ${convertPressure(data.pressure)}inHg</p>
        `;
        weatherDataDisplay.classList.remove('hidden');

        // Add hidden inputs to include weather data in form submission
        const hiddenInputs = `
            <input type="hidden" name="weather[temperature]" value="${data.temperature}">
            <input type="hidden" name="weather[conditions]" value="${data.conditions}">
            <input type="hidden" name="weather[humidity]" value="${data.humidity}">
            <input type="hidden" name="weather[pressure]" value="${data.pressure}">
        `;
        weatherInfo.insertAdjacentHTML('beforeend', hiddenInputs);
    }
});