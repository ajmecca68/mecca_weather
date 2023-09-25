const cityInput = document.getElementById("cityInput");
const searchArrow = document.getElementById("searchArrow");
const currentWeather = document.getElementById("currentWeather");
const forecast = document.getElementById("forecast");
const searchButtonsContainer = document.getElementById("searchButtons");
const apiKey = "f1f694511036044da0c13d474ba1001e";
const today = new Date(); // Get today's date
const formattedDate = today.toLocaleDateString();
// let myChart = null;

// Function to convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

function saveCityToLocalStorage(city) {
    const previousCities = JSON.parse(localStorage.getItem("previousCities")) || [];
    if (!previousCities.includes(city)) {
        previousCities.push(city);
        localStorage.setItem("previousCities", JSON.stringify(previousCities));
    }
}

function displayPreviousSearchButtons() {
    const previousCities = JSON.parse(localStorage.getItem("previousCities")) || [];
    let clearLink = previousCities.length ? '<a href="#" id="clearCities">Clear</a>' : '';
    searchButtonsContainer.innerHTML = previousCities
    .map(city => `<button class="search-button" onclick="searchCity('${city}')">${city}</button>`)
    .join("");
    cityInput.value = "";
}

document.getElementById('clearCitiesIcon').addEventListener('click', function() {
    clearAllCitiesFromLocalStorage();
    displayPreviousSearchButtons();
});

// Get Todays Weather
function searchCity(city) {
    cityInput.value = city;
    
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            updateWeatherCard(data);
        })
        .catch(error => {
            console.error("Error fetching current weather:", error);
        });
    // Fetch the 5-day forecast for the city
    fetchFiveDayForecast(city);

    saveCityToLocalStorage(city);
    displayPreviousSearchButtons();
}

function updateWeatherCard(data) {
    const weatherCard = document.getElementById("currentWeather");
    
    if (data && data.weather && data.weather[0] && data.weather[0].id) {
        const weatherConditionCode = data.weather[0].id; 
        const temperature = Math.ceil((data.main.temp*9/5)+23)
        console.log("Weather Condition Code:", weatherConditionCode);
        const windSpeed = data.wind.speed;
        weatherCard.innerHTML = `
        <h2>${data.name} - ${formattedDate}</h2>
        <div style="display: flex;">
            <img id="weatherImage" src="" alt="">
            <div class="todaysForecast">
                <p>Temperature: ${temperature}°F</p>
                <p>Wind: ${windSpeed}m/s</p>
                <p>Weather: ${data.weather[0].description}</p>
            </div>
        </div>
    `;
        weatherCard.classList.remove("no-border");
        // Check weather condition code and set appropriate image
        if (weatherConditionCode < 600) {
            document.getElementById("weatherImage").src = "assets/images/raingif.gif";
            document.getElementById("weatherImage").alt = "Rainy Image"; 
        } else if (weatherConditionCode < 700) {
            document.getElementById("weatherImage").src = "assets/images/snowgif.gif"; 
            document.getElementById("weatherImage").alt = "Snowing Image"; 
        } else if (weatherConditionCode === 800) {
            document.getElementById("weatherImage").src = "assets/images/clearsunnygif.gif";
            document.getElementById("weatherImage").alt = "Sunny Image"; 
        } else if (weatherConditionCode === 804) {
            document.getElementById("weatherImage").src = "assets/images/cloudygif.gif"; 
            document.getElementById("weatherImage").alt = "Cloudy Image"; 
        } else {
            document.getElementById("weatherImage").src = "assets/images/cloudygif.gif";
            document.getElementById("weatherImage").alt = "Cloudy Image"; 
        }
    } else {
        weatherCard.innerHTML = "";
        weatherCard.classList.add("no-border");
        weatherImage.src = ""; // Clear the image source
    }
}


searchArrow.addEventListener("click", function() {
    // Code to execute when the searchArrow is clicked
    const city = cityInput.value;
    searchCity(city);
});
// End get todays weather

function fetchFiveDayForecast(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayFiveDayForecast(data);
    })
    .catch(error => {
      console.error("Error fetching 5-day forecast:", error);
    });
}

function displayFiveDayForecast(data) {
    // Skip the first element to start the forecast from tomorrow
    console.log(data.list.length);
    console.log("Inside displayFiveDayForecast function");
    
    const filteredData = data.list.filter((_, index) => index % 8 === 0);

    const forecastCards = filteredData.map((forecastData, index) => {
        const date = new Date(forecastData.dt * 1000);
        const temperature = Math.ceil(celsiusToFahrenheit(forecastData.main.temp));
        const weatherConditionCode = forecastData.weather[0].id;
        let bgImage = '';
        const windSpeed = forecastData.wind.speed;
        console.log(weatherConditionCode)
        if (weatherConditionCode < 600) {
            bgImage = 'assets/images/raingif.gif';
        } else if (weatherConditionCode < 700) {
            bgImage = 'assets/images/snowgif.gif';
        } else if (weatherConditionCode === 800) {
            bgImage = 'assets/images/clearsunnygif.gif';
        } else if (weatherConditionCode === 801) {
            bgImage = 'assets/images/cleargif.gif';
        } else if (weatherConditionCode === 802) {
            bgImage = 'assets/images/scatteredcloudsgif.gif';
        } else if (weatherConditionCode === 804) {
            bgImage = 'assets/images/overcastcloudsgif.gif';
        } else {
            bgImage = 'assets/images/cloudygif.gif';
        }

        return `
        <div class="forecast-card" style="background-image: url('${bgImage}'); background-size: cover; opacity: 0.9; ${[803, 804, 500, 501].includes(weatherConditionCode) ? 'color: white;' : ''}">
                <h4>${date.toDateString()}</h4>
                <p>Temperature: ${temperature}°F</p>
                <p>Wind: ${windSpeed}m/s</p>
                <p>Weather: ${forecastData.weather[0].description}</p>
            </div>
        `;
 
    })
    forecast.innerHTML = forecastCards.join("");
}
   
document.addEventListener('click', function(event) {
    if (event.target.id === 'clearCities') {
        event.preventDefault();
        clearAllCitiesFromLocalStorage();
        displayPreviousSearchButtons();
    }
});

function clearAllCitiesFromLocalStorage() {
    localStorage.removeItem("previousCities");
}

displayPreviousSearchButtons();