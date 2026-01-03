const API_KEY = 'YOUR_API_KEY'; // Replace with your API key
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const weatherDisplay = document.getElementById('weather-display');

// Function to fetch weather data
async function getWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  
  // Show loading, hide other elements
  loading.classList.remove('hidden');
  error.classList.add('hidden');
  weatherDisplay.classList.add('hidden');
  
  try {
    const response = await fetch(apiUrl); // Calls the API and returns a response object
    
    // Check if city was found (This is the error handling part)
    if (!response.ok) {
      if (response.status === 404) {// user typed a city that doesn't exist
        throw new Error('City not found. Please check the spelling.');
      } else { // otherwise show a generic error
        throw new Error('Failed to fetch weather data. Please try again.');
      }
    }
    
    const data = await response.json(); // turn raw response into JSON
    console.log(data); // Log the data for debugging
    displayWeather(data);
    
  } catch (err) {
    showError(err.message); // Show the error message to the user
  } finally {
    loading.classList.add('hidden'); // Hide loading spinner
  }
}

// Function to display weather data
function displayWeather(data) {
  document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`; // City, Country
  document.getElementById('temp').textContent = Math.round(data.main.temp); // current temperature
  document.getElementById('feels-like').textContent = Math.round(data.main.feels_like); // feels like temperature
  document.getElementById('humidity').textContent = data.main.humidity; // humidity percentage
  document.getElementById('wind').textContent = data.wind.speed; // wind speed
  document.getElementById('description').textContent = data.weather[0].description; // weather description

  // Set weather icon
  const iconCode = data.weather[0].icon;
  document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // OpenWeatherMap icon URL
  
  weatherDisplay.classList.remove('hidden');
}

// Function to show error
function showError(message) {
  error.textContent = message;
  error.classList.remove('hidden');
}

// Event listeners
searchBtn.addEventListener('click', () => { // When search button is clicked
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  } else {
    showError('Please enter a city name');
  }
});

cityInput.addEventListener('keypress', (e) => {// Allow pressing Enter to search
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});

// Load default city on page load
getWeather('London');// You can change 'London' to any default city you prefer
