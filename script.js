const apiKey = 'd0077923ae63bf123b93689d06d6f4a5'; // Replace with your OpenWeatherMap API key

function getWeather() {
    const city = document.getElementById('city').value.trim();
    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            getAirQuality(data.coord.lat, data.coord.lon);
            updateBackground(data.weather[0].main);
        })
        .catch(error => {
            console.error('Error fetching weather:', error);
            alert('Failed to fetch weather data.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => displayHourlyForecast(data.list))
        .catch(error => {
            console.error('Error fetching forecast:', error);
        });
}

function displayWeather(data) {
    const tempDiv = document.getElementById('temp-div');
    const weatherInfo = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const airQualityDiv = document.getElementById('air-quality');
    const forecastDiv = document.getElementById('hourly-forecast');

    tempDiv.innerHTML = '';
    weatherInfo.innerHTML = '';
    airQualityDiv.innerHTML = '';
    forecastDiv.innerHTML = '';

    if (data.cod === '404') {
        weatherInfo.innerHTML = `<p>${data.message}</p>`;
        return;
    }

    const temperature = Math.round(data.main.temp - 273.15);
    const cityName = data.name;
    const description = data.weather[0].description;
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    tempDiv.innerHTML = `<p>${temperature}°C</p>`;
    weatherInfo.innerHTML = `
        <p><strong>${cityName}</strong></p>
        <p>${description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Pressure: ${data.main.pressure} hPa</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    weatherIcon.style.display = 'block';
}

function displayHourlyForecast(hourlyData) {
    const forecastDiv = document.getElementById('hourly-forecast');
    const next8 = hourlyData.slice(0, 8); // 24 hours = 8 * 3h intervals

    next8.forEach(item => {
        const time = new Date(item.dt * 1000).getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

        forecastDiv.innerHTML += `
            <div class="hourly-item">
                <span>${time}:00</span>
                <img src="${icon}" alt="icon">
                <span>${temperature}°C</span>
            </div>
        `;
    });
}

function getAirQuality(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const aqi = data.list[0].main.aqi;
            const levels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
            const airQualityDiv = document.getElementById('air-quality');
            airQualityDiv.innerHTML = `<p>Air Quality Index: ${aqi} (${levels[aqi - 1]})</p>`;
        })
        .catch(err => {
            console.error('Air Quality API error:', err);
        });
}

function updateBackground(weatherMain) {
    const bgMap = {
        Clear: 'images/clear-sky.jpg',
        Clouds: 'images/cloudy.jpg',
        Rain: 'images/rainy.jpg',
        Snow: 'images/snow.jpg'
    };
    document.body.style.backgroundImage = `url('${bgMap[weatherMain] || 'images/default.jpg'}')`;
}
