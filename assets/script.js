
let inputList = []
let cityList = []

if (localStorage.getItem('cityList')) {
    let cityList =  localStorage.getItem('cityList').split(",");    
    for (var i=0; i<cityList.length; i++) {
        $(`.list-group`).append(`<button type="button" class="btn btn-secondary">` + cityList[i] + `</button>`);
    }
    $('.btn-secondary').click(buttonInput)
}

async function getInput() {
    let userInput  = document.querySelector('input').value;
    let geoURL = 'http://api.openweathermap.org/geo/1.0/direct?q='.concat(userInput, '&appid=6d5b483be1e33702dfcdcba9ef8ea047');
    let results = await fetch(geoURL); 
    let data = await results.json(); 
    
    let lat = data[0].lat;
    let lon = data[0].lon;

    //makes sure the city has not already been called
    if (inputList.includes(userInput)) {
        alert("Put in a new city!")
    } else {
        inputList.push(userInput); 
        localStorage.setItem('cityList', inputList); 
        currentWeather(lat,lon,userInput);
        $(`.list-group`).append(`<button type="button" class="btn btn-secondary">` + userInput + `</button>`);
    }

    $('.btn-secondary').click(buttonInput)
    
    // catch (e) {
    //     alert('Input a proper city!')
    // }
    
}


async function buttonInput(event) {
    // let userInput  = document.querySelector('input').value;
    let userInput = event.target.textContent;
    let geoURL = 'http://api.openweathermap.org/geo/1.0/direct?q='.concat(userInput, '&appid=6d5b483be1e33702dfcdcba9ef8ea047');
    let results = await fetch(geoURL); 
    let data = await results.json(); 
    
    let lat = data[0].lat;
    let lon = data[0].lon;

    currentWeather(lat,lon,userInput);

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
        $('.city-box').css('border', '1px solid black');

        var now = dayjs(); 
        $('#title-city-box').text(userInput + now.format(' (M/D/YYYY)'));

        forecastWeather(lat, lon);

}

async function forecastWeather(lat, lon) {
    let forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?lat='.concat(lat,'&','lon=',lon, '&appid=6d5b483be1e33702dfcdcba9ef8ea047')
    let forecastResults = await fetch(forecastURL); 
    let forecastData = await forecastResults.json();
    $(`#forecast`).html(' ');
    
    $('.forecast-title').text("5 Day Forecast");

    let noonArray = []

    //finds all noon times
    for (var i=0; i<forecastData.list.length; i++) {
        if (forecastData.list[i].dt_txt.includes("12:00:00")) {
            noonArray.push(forecastData.list[i]);
        }
    };


    for (var i=0; i<noonArray.length; i++) {
        
        let timeStamp = dayjs(noonArray[i].dt*1000).format('MM/DD/YYYY');
        let icon = noonArray[i].weather[0].icon; 
        let iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
        let temp = 1.8*(noonArray[i].main.temp - 273) + 32; 
        let windSpeed = noonArray[i].wind.speed; 
        let humidity = noonArray[i].main.humidity; 
        
        
        $('#forecast').append(`<div class="col" id=card-` + [i] + `></div>`);    

        $(`#card-`+[i]).append(`<p class=timeStamp>`+ timeStamp + `</p>`);
        $(`#card-`+[i]).append(`<img id="wicon" src="` + iconurl + `" alt="Weather icon"></img>`);
        $(`#card-`+[i]).append(`<p>Temperature: ` + temp.toFixed(2) + `\u00B0F` + `</p>`);
        $(`#card-`+[i]).append(`<p>Wind: ` + windSpeed.toFixed(2) + ` MPH` + `</p>`);
        $(`#card-`+[i]).append(`<p>Humidity: ` + humidity.toFixed(2) + ` %` + `</p>`);
    
        };
    } 




$('.btn-primary').click(getInput);