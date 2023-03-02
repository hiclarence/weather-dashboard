async function getWeather() {
    // get intake form
    // input into URL
    
    let requestedURL = 'https://api.openweathermap.org/data/2.5/weather?lat=39.8865&lon=-83.4483&appid=6d5b483be1e33702dfcdcba9ef8ea047'
    let results = await fetch(requestedURL); 
    let data = await results.json();
    
    let temp = 1.8*(data.main.temp - 273) + 32; 
    let windSpeed = data.wind.speed; 
    let humidity = data.main.humidity; 
}



function getInput() {

    // console.log(userInput);
    $("button").click(async function () {
        let userInput  = document.querySelector('input').value;
        let geoURL = 'http://api.openweathermap.org/geo/1.0/direct?q='.concat(userInput, '&appid=6d5b483be1e33702dfcdcba9ef8ea047');
        let results = await fetch(geoURL); 
        let data = await results.json(); 
        
        let lat = data[0].lat;
        let lon = data[0].lon;

        currentWeather(lat,lon,userInput);

    })
}

async function currentWeather(lat, lon, userInput) {
    let mainURL = 'https://api.openweathermap.org/data/2.5/weather?lat='.concat(lat,'&','lon=',lon, '&appid=6d5b483be1e33702dfcdcba9ef8ea047')
        let mainResults = await fetch(mainURL); 
        let mainData = await mainResults.json();
        
        let temp = 1.8*(mainData.main.temp - 273) + 32; 
        let windSpeed = mainData.wind.speed; 
        let humidity = mainData.main.humidity; 
        let icon = mainData.weather[0].icon; 
        var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
        $('#wicon').attr('src', iconurl);

        $('#temp-city-box').text('Temperature: '.concat(temp.toFixed(2), '\u00B0F'))
        $('#wind-city-box').text('Wind: '.concat(windSpeed.toFixed(2), ' MPH'))
        $('#humidity-city-box').text('Humidity: '.concat(humidity, '%'))

        var now = dayjs(); 
        $('#title-city-box').text(userInput + now.format(' (M/D/YYYY)'));
        forecastWeather(lat, lon);

}

async function forecastWeather(lat, lon) {
    let forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?lat='.concat(lat,'&','lon=',lon, '&appid=6d5b483be1e33702dfcdcba9ef8ea047')
    let forecastResults = await fetch(forecastURL); 
    let forecastData = await forecastResults.json();

    let noonArray = []

    for (var i=0; i<forecastData.list.length; i++) {
        if (forecastData.list[i].dt_txt.includes("12:00:00")) {
            noonArray.push(forecastData.list[i]);
        }
    };
    console.log(noonArray);
    // console.log(dayjs(forecastData.list[i].dt*1000).format('MM/DD/YYYY'));
}

getInput();


// Set up basic HTML and CSS stucture - leverage bootstrap when needed
// Make a call to the weather map API
    // - use the geocoding API to determine lat and lon of a city
    // make sure 

// Have the user put in the city
// the api returns the city call with specific parameters
// use the appropriate html id tags to identify each 

// store current state into local storage