const cityInput = document.getElementById("cityInput");
const searchArrow = document.getElementById("searchArrow");
const currentWeather = document.getElementById("currentWeather");
const forecast = document.getElementById("forecast");
const searchButtonsContainer = document.getElementById("searchButtons");
const apiKey = "f1f694511036044da0c13d474ba1001e";

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
    searchButtonsContainer.innerHTML = previousCities
        .map(city => `<button class="search-button" onclick="searchCity('${city}')">${city}</button>`)
        .join("");
}

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
        weatherCard.innerHTML = `
            <h2>Current Weather in ${data.name}</h2>
            <p>Temperature: ${temperature}°F</p>
            <p>Weather: ${data.weather[0].description}</p>
            <img id="weatherImage" src="" alt="">
        `;
        weatherCard.classList.remove("no-border");
        // Check weather condition code and set appropriate image
        if (weatherConditionCode < 600) {
            document.getElementById("weatherImage").src = "assets/images/rainy.png";
            document.getElementById("weatherImage").alt = "Rainy Image"; 
        } else if (weatherConditionCode < 700) {
            document.getElementById("weatherImage").src = "assets/images/snowy.png"; 
            document.getElementById("weatherImage").alt = "Snowing Image"; 
        } else if (weatherConditionCode === 800) {
            document.getElementById("weatherImage").src = "assets/images/sunny.png";
            document.getElementById("weatherImage").alt = "Sunny Image"; 
        } else if (weatherConditionCode === 804) {
            document.getElementById("weatherImage").src = "assets/images/cloudy.png"; 
            document.getElementById("weatherImage").alt = "Cloudy Image"; 
        } else {
            document.getElementById("weatherImage").src = "assets/images/cloudy.png";
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
  const forecastCards = data.list
    .filter((_, index) => index % 8 === 0) // Pick 5 points approximately 24 hours apart
    .map((forecastData, index) => {
      const date = new Date(forecastData.dt * 1000);
      const temperature = Math.ceil(celsiusToFahrenheit(forecastData.main.temp));
      return `
        <div class="forecast-card">
          <h3>Day ${index + 1} (${date.toDateString()})</h3>
          <p>Temperature: ${temperature}°F</p>
          <p>Weather: ${forecastData.weather[0].description}</p>
        </div>
      `;
    })
    .join("");

  forecast.innerHTML = forecastCards;
}


displayPreviousSearchButtons();