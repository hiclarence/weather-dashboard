
let inputList = []

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
        currentWeather(lat,lon,userInput);
        $(`.list-group`).append(`<button type="button" class="btn btn-secondary">` + userInput + `</button>`);
    }

    $('.btn-secondary').click(buttonInput);
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

        var now = dayjs(); 
        $('#title-city-box').text(userInput + now.format(' (M/D/YYYY)'));

        forecastWeather(lat, lon);

}

async function forecastWeather(lat, lon) {
    let forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?lat='.concat(lat,'&','lon=',lon, '&appid=6d5b483be1e33702dfcdcba9ef8ea047')
    let forecastResults = await fetch(forecastURL); 
    let forecastData = await forecastResults.json();

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
        
        // if new element is equal

        if (inputList.length >= 1) {
            $('#forecast').innerHTML = ' ';
            $(`#card-`+[i]).append(`<p class=timeStamp>`+ timeStamp + `</p>`);
            $(`#card-`+[i]).append(`<img id="wicon" src="` + iconurl + `" alt="Weather icon"></img>`);
            $(`#card-`+[i]).append(`<p>Temperature: ` + temp.toFixed(2) + `\u00B0F` + `</p>`);
            $(`#card-`+[i]).append(`<p>Wind: ` + windSpeed.toFixed(2) + ` MPH` + `</p>`);
            $(`#card-`+[i]).append(`<p>Humidity: ` + humidity.toFixed(2) + ` %` + `</p>`);
        } else {
            $(`#card-`+[i]).append(`<p class=timeStamp>`+ timeStamp + `</p>`);
            $(`#card-`+[i]).append(`<img id="wicon" src="` + iconurl + `" alt="Weather icon"></img>`);
            $(`#card-`+[i]).append(`<p>Temperature: ` + temp.toFixed(2) + `\u00B0F` + `</p>`);
            $(`#card-`+[i]).append(`<p>Wind: ` + windSpeed.toFixed(2) + ` MPH` + `</p>`);
            $(`#card-`+[i]).append(`<p>Humidity: ` + humidity.toFixed(2) + ` %` + `</p>`);
        }
        
    
    } 

}


$('.btn-primary').click(getInput);





// var userFormEl = document.querySelector('#user-form');
// var languageButtonsEl = document.querySelector('#language-buttons');
// var nameInputEl = document.querySelector('#username');
// var repoContainerEl = document.querySelector('#repos-container');
// var repoSearchTerm = document.querySelector('#repo-search-term');

// var formSubmitHandler = function (event) {
//   event.preventDefault();

//   var username = nameInputEl.value.trim();

//   if (username) {
//     getUserRepos(username);

//     repoContainerEl.textContent = '';
//     nameInputEl.value = '';
//   } else {
//     alert('Please enter a GitHub username');
//   }
// };

// var buttonClickHandler = function (event) {
//   var language = event.target.getAttribute('data-language');

//   if (language) {
//     getFeaturedRepos(language);

//     repoContainerEl.textContent = '';
//   }
// };

// var getUserRepos = function (user) {
//   var apiUrl = 'https://api.github.com/users/' + user + '/repos';

//   fetch(apiUrl)
//     .then(function (response) {
//       if (response.ok) {
//         console.log(response);
//         response.json().then(function (data) {
//           console.log(data);
//           displayRepos(data, user);
//         });
//       } else {
//         alert('Error: ' + response.statusText);
//       }
//     })
//     .catch(function (error) {
//       alert('Unable to connect to GitHub');
//     });
// };

// var getFeaturedRepos = function (language) {
//   var apiUrl = 'https://api.github.com/search/repositories?q=' + language + '+is:featured&sort=help-wanted-issues';

//   fetch(apiUrl).then(function (response) {
//     if (response.ok) {
//       response.json().then(function (data) {
//         displayRepos(data.items, language);
//       });
//     } else {
//       alert('Error: ' + response.statusText);
//     }
//   });
// };

// var displayRepos = function (repos, searchTerm) {
//   if (repos.length === 0) {
//     repoContainerEl.textContent = 'No repositories found.';
//     return;
//   }

//   repoSearchTerm.textContent = searchTerm;

//   for (var i = 0; i < repos.length; i++) {
//     var repoName = repos[i].owner.login + '/' + repos[i].name;

//     var repoEl = document.createElement('a');
//     repoEl.classList = 'list-item flex-row justify-space-between align-center';
//     repoEl.setAttribute('href', './single-repo.html?repo=' + repoName);

//     var titleEl = document.createElement('span');
//     titleEl.textContent = repoName;

//     repoEl.appendChild(titleEl);

//     var statusEl = document.createElement('span');
//     statusEl.classList = 'flex-row align-center';

//     if (repos[i].open_issues_count > 0) {
//       statusEl.innerHTML =
//         "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
//     } else {
//       statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
//     }

//     repoEl.appendChild(statusEl);

//     repoContainerEl.appendChild(repoEl);
//   }
// };

// userFormEl.addEventListener('submit', formSubmitHandler);
// languageButtonsEl.addEventListener('click', buttonClickHandler);
