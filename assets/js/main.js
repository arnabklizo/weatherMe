const navSearch = document.querySelector('.navSearch');
const navSearchBtn = document.querySelector('.navSearchBtn');
const themeBox = document.querySelector('.themeBox');
const checkbox = document.querySelector('#checkbox');
const timeformatter = document.querySelector('.timeformatter');
const tempBoxToggler = document.querySelector('.toggle-switch')
const tempInp = document.querySelector('.tempInp');
const tempInpSpan = document.querySelector('.tempInpSpan');


// declarations end 


// on load set up 
window.onload = function () {

    const weatherMode = localStorage.getItem("weatherMode");          // get previous Theme mode 
    if (weatherMode == 'dark') {                                      //body tag class change
        checkbox.checked = true
        document.body.classList.add('darkMode');        //body tag class change to darkMode
    }


    let celsius = localStorage.getItem("celsius");
    if (celsius == 'false') {
        tempInp.checked = true;
        tempInpSpan.textContent = 'F'        //body tag class change to darkMode
    }
    if (celsius == 'true') {
        tempInp.checked = false;
        tempInpSpan.textContent = 'C'        //body tag class change to darkMode
    }
    searchdata('kolkata');
};

// search box content 
navSearchBtn.addEventListener('click', function (e) {
    e.preventDefault();
    let searchValue = navSearch.value;
    // console.log('https://api.weatherapi.com/v1/forecast.json?key=ce2e576b68634d78985102848240811&q=' + searchValue + '&aqi=yes&alerts=yes&days=7');
    // console.log(searchValue);

    searchdata(searchValue)
    navSearch.value = '';
})

// search button on change Hide/unhide
navSearch.addEventListener('keyup', function () {
    if (navSearch.value.length == 0) {
        navSearchBtn.classList.remove('notHide')
    } else if (navSearch.value.length > 0) {
        navSearchBtn.classList.add('notHide')
    }
});


// on click temperature changer button 
tempBoxToggler.addEventListener('click', function () {
    if (tempInp.checked == true) {
        tempInpSpan.textContent = 'F'        //changed to farenheit
        localStorage.setItem("celsius", false);

        const locality = document.querySelector('.Locality');
        searchdata(locality.textContent)
    }
    if (tempInp.checked == false) {
        tempInpSpan.textContent = 'C'     // changed to celsius
        localStorage.setItem("celsius", true);

        const locality = document.querySelector('.Locality');
        searchdata(locality.textContent)
    }
})

// on click theme changer button 
themeBox.addEventListener('click', function () {
    if (checkbox.checked == true) {
        document.body.classList.add('darkMode');        //body tag class change to darkMode
        localStorage.setItem("weatherMode", "dark");
    }
    if (checkbox.checked == false) {
        document.body.classList.remove('darkMode');     //body tag class change LightMode
        localStorage.setItem("weatherMode", "light");
    }
})

// search data 
function searchdata(area) {
    let loader = document.querySelector('.loader');
    loader.style.display = 'flex';
    const apiKey = 'ce2e576b68634d78985102848240811'
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${area}&aqi=yes&alerts=yes&days=2`;

    // console.log(url);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // dataFill(data); console.log(data)
            try { dataFill(data); console.log(data) }
            catch { alert(data.error.message); } // prompting errors message
        });
    setTimeout(() => { loader.style.display = 'none'; }, 500)
}

// after get data 
function dataFill(data) {

    let celsius = localStorage.getItem("celsius");
    // locality 
    const locality = document.querySelector('.Locality');
    const country = document.querySelector('.country');

    locality.textContent = data.location.name;
    country.textContent = data.location.country;



    // live time 
    const timeBox = document.querySelector('.timeBox');

    const timeNow = new Date(data.location.localtime);
    const hours = String(timeNow.getHours()).padStart(2, '0');
    const minutes = String(timeNow.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    timeBox.textContent = formattedTime;


    // date 
    const dateBox = document.querySelector('.dateBox');

    const dateToday = new Date(data.forecast.forecastday[0].date);
    const formatter = new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
    });

    const parts = formatter.formatToParts(dateToday);
    const formattedWithComma = `${parts.find(p => p.type === 'weekday').value}, ${parts.find(p => p.type === 'day').value} ${parts.find(p => p.type === 'month').value}`;

    dateBox.textContent = formattedWithComma;



    // temperature 
    const temparatureNow = document.querySelector('.temparatureNow');
    const tempIn = document.querySelector('.tempIn');

    if (celsius == 'true') {
        temparatureNow.textContent = data.current.temp_c; //in C
        tempIn.textContent = 'C'
    } else {
        temparatureNow.textContent = data.current.temp_f; //in F
        tempIn.textContent = 'F'
    }


    // feels leke 
    const feelTemp = document.querySelector('.feelTemp');
    const feelTempIn = document.querySelector('.feelTempIn');

    if (celsius == 'true') {
        feelTemp.textContent = data.current.feelslike_c;
        feelTempIn.textContent = 'C'
    } else {
        feelTemp.textContent = data.current.feelslike_f;
        feelTempIn.textContent = 'F'
    }


    // sunrise 
    const sunrise = document.querySelector('.sunrise');

    sunrise.textContent = data.forecast.forecastday[0].astro.sunrise;


    //sunset
    const sunset = document.querySelector('.sunset');

    sunset.textContent = data.forecast.forecastday[0].astro.sunset;


    // weather image
    const conditionImg = document.querySelector('.conditionImg');

    conditionImg.src = `assets/images/icon/${data.current.condition.code}${data.current.is_day}.png`;


    //weather condition text
    const conditionText = document.querySelector('.conditionText');

    conditionText.textContent = data.current.condition.text;
    backgroundChanger(data.current.condition.text + data.current.is_day);

    // humidity 
    const humidity = document.querySelector('.humidity');

    humidity.textContent = data.current.humidity;


    // wind speed 
    const wind_kph = document.querySelector('.wind_kph');

    wind_kph.textContent = data.current.wind_kph;


    // wind pressure 
    const pressure_mb = document.querySelector('.pressure_mb')

    pressure_mb.textContent = data.current.pressure_mb;

    // uv index 
    const uv = document.querySelector('.uv')

    uv.textContent = data.current.uv;



    // Hourly Forecast 
    const dailyfrcst = document.querySelector('.dailyfrcst');
    const hourForcust = data.forecast.forecastday[0].hour;

    // const forcastBox = document.querySelectorAll('.forcastBox')
    if (celsius == 'true') {
        dailyfrcst.innerHTML = '';
        for (let i = 0; i < hourForcust.length; i++) {
            dailyfrcst.innerHTML += `<div class="forcastBox">
                        <div class="d-flex align-items-center justify-content-center">
                            <div class="card d-flex flex-row align-items-center ${hourForcust[i].is_day ? 'hourDay' : 'hourNight'}">
                                <div class="hrlcondBox">
                                    <div class="overflow-hidden h-100 w-100">
                                        <img src="assets/images/icon/${hourForcust[i].condition.code}${hourForcust[i].is_day}.png" alt="" class="conditionImg">
                                    </div>
                                </div>
                                <div class="fs-3">
                                    <div class="fw-bold">${hourForcust[i].time.split(' ')[1]}</div>
                                    <div class="hrtmpS">${hourForcust[i].temp_c}°C</div>
                                </div>
                            </div>

                            <div class="card2">
                                <div class="upper">
                                    <div class="humidity">
                                        <img src="assets/images/icon/navigation 1.png" alt="" class="navigationImg ${hourForcust[i].wind_dir}">
                                    </div>

                                    <div class="air  d-flex align-items-center">
                                        <i class="fa-solid fa-wind fs-2 text-info"></i>
                                        <div class="ms-2">
                                            <div class="fw-bold">Wind</div>
                                            <div class="">${hourForcust[i].wind_mph} Km/h</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="lower justify-content-between">
                                    <div class="">
                                        <div class="aqitext">
                                            <div class="fw-bold">Feels Like</div>
                                            <div class="">${hourForcust[i].feelslike_c}°C</div>
                                        </div>
                                    </div>

                                    <div class="">

                                        <div class="realfeeltext">
                                            <div class="fw-bold">Humidity</div>
                                            <div class="">${hourForcust[i].humidity}%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
        }
    } else {
        dailyfrcst.innerHTML = '';
        for (let i = 0; i < hourForcust.length; i++) {
            dailyfrcst.innerHTML += `<div class="forcastBox"><div class="d-flex align-items-center justify-content-center">
                            <div class="card d-flex flex-row align-items-center ${hourForcust[i].is_day ? 'hourDay' : 'hourNight'}">
                                <div class="hrlcondBox">
                                    <div class="overflow-hidden h-100 w-100">
                                        <img src="assets/images/icon/${hourForcust[i].condition.code}${hourForcust[i].is_day}.png" alt="" class="conditionImg">
                                    </div>
                                </div>
                                <div class="fs-3">
                                    <div class="fw-bold">${hourForcust[i].time.split(' ')[1]}</div>
                                    <div class="hrtmpS">${hourForcust[i].temp_f}°F</div>
                                </div>
                            </div>

                            <div class="card2">
                                <div class="upper">
                                    <div class="humidity">
                                        <img src="assets/images/icon/navigation 1.png" alt="" class="navigationImg ${hourForcust[i].wind_dir}">
                                    </div>

                                    <div class="air  d-flex align-items-center">
                                        <i class="fa-solid fa-wind fs-2 text-info"></i>
                                        <div class="ms-2">
                                            <div class="fw-bold">Wind</div>
                                            <div class="">${hourForcust[i].wind_mph} Km/h</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="lower justify-content-between">
                                    <div class="">
                                        <div class="aqitext">
                                            <div class="fw-bold">Feels Like</div>
                                            <div class="">${hourForcust[i].feelslike_f}°F</div>
                                        </div>
                                    </div>

                                    <div class="">

                                        <div class="realfeeltext">
                                            <div class="fw-bold">Humidity</div>
                                            <div class="">${hourForcust[i].humidity}%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div></div>`
        }
    }


    // tomorrwo box 

    if (celsius == 'true') {
        const tomorrowTemp = document.querySelector('.tomorrowTemp ');
        tomorrowTemp.textContent = data.forecast.forecastday[1].day.avgtemp_c + '°C'

        const tomorrowDay = document.querySelector('.tomorrowDay');
        tomorrowDay.textContent = data.forecast.forecastday[1].day.condition.text;

        const dateBox = document.querySelector('.dateTomorrow');
        const dateToday = new Date(data.forecast.forecastday[1].date);
        const formatter = new Intl.DateTimeFormat('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
        });

        const parts = formatter.formatToParts(dateToday);
        const formattedWithComma = `${parts.find(p => p.type === 'weekday').value}, ${parts.find(p => p.type === 'day').value} ${parts.find(p => p.type === 'month').value}`;
        dateBox.textContent = formattedWithComma;

        const conditionImg = document.querySelector('.conditionTom');
        conditionImg.src = `assets/images/icon/${data.forecast.forecastday[1].day.condition.code}1.png`;


        const sunriseTom = document.querySelector('.sunriseTom');
        sunriseTom.textContent = data.forecast.forecastday[1].astro.sunrise;

        const sunsetTom = document.querySelector('.sunsetTom');
        sunsetTom.textContent = data.forecast.forecastday[1].astro.sunset;

        const humidityTomorrow = document.querySelector('.humidityTomorrow');
        humidityTomorrow.textContent = data.forecast.forecastday[1].day.avghumidity;

        const wind_kphTomorrow = document.querySelector('.wind_kphTomorrow');
        wind_kphTomorrow.textContent = data.forecast.forecastday[1].day.maxwind_kph;

        const pressure_mbTomorrow = document.querySelector('.pressure_mbTomorrow');
        pressure_mbTomorrow.textContent = data.current.pressure_mb;

        const uvTomorrow = document.querySelector('.uvTomorrow');
        uvTomorrow.textContent = data.forecast.forecastday[1].day.uv;
    } else {
        const tomorrowTemp = document.querySelector('.tomorrowTemp ');
        tomorrowTemp.textContent = data.forecast.forecastday[1].day.avgtemp_f + '°F'

        const tomorrowDay = document.querySelector('.tomorrowDay');
        tomorrowDay.textContent = data.forecast.forecastday[1].day.condition.text;

        const dateBox = document.querySelector('.dateTomorrow');
        const dateToday = new Date(data.forecast.forecastday[1].date);
        const formatter = new Intl.DateTimeFormat('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
        });

        const parts = formatter.formatToParts(dateToday);
        const formattedWithComma = `${parts.find(p => p.type === 'weekday').value}, ${parts.find(p => p.type === 'day').value} ${parts.find(p => p.type === 'month').value}`;
        dateBox.textContent = formattedWithComma;

        const conditionImg = document.querySelector('.conditionTom');
        conditionImg.src = `assets/images/icon/${data.forecast.forecastday[1].day.condition.code}1.png`;


        const sunriseTom = document.querySelector('.sunriseTom');
        sunriseTom.textContent = data.forecast.forecastday[1].astro.sunrise;

        const sunsetTom = document.querySelector('.sunsetTom');
        sunsetTom.textContent = data.forecast.forecastday[1].astro.sunset;

        const humidityTomorrow = document.querySelector('.humidityTomorrow');
        humidityTomorrow.textContent = data.forecast.forecastday[1].day.avghumidity;

        const wind_kphTomorrow = document.querySelector('.wind_kphTomorrow');
        wind_kphTomorrow.textContent = data.forecast.forecastday[1].day.maxwind_kph;

        const pressure_mbTomorrow = document.querySelector('.pressure_mbTomorrow');
        pressure_mbTomorrow.textContent = data.current.pressure_mb;

        const uvTomorrow = document.querySelector('.uvTomorrow');
        uvTomorrow.textContent = data.forecast.forecastday[1].day.uv;
    }






    // time button reset 
    timeformatter.textContent = "AM/PM";
}

// AM/PM - 24 hours 
timeformatter.addEventListener('click', function () {
    if (timeformatter.textContent == "AM/PM") {
        timeformatter.textContent = "24-HOUR"


        const timeBox = document.querySelector('.timeBox');

        let [hours, minutes] = timeBox.textContent.split(':');
        hours = parseInt(hours);

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format and adjust 0 to 12

        timeBox.textContent = `${hours}:${minutes} ${ampm}`;

    } else {
        timeformatter.textContent = "AM/PM";

        const timeBox = document.querySelector('.timeBox');


        let [timePart, modifier] = timeBox.textContent.split(' ');
        let [hours, minutes] = timePart.split(':');
        hours = parseInt(hours);

        if (modifier === 'PM' && hours !== 12) {
            hours += 12;
        } else if (modifier === 'AM' && hours === 12) {
            hours = 0;
        }

        timeBox.textContent = `${String(hours).padStart(2, '0')}:${minutes}`;


    }
})



// background changer 
function backgroundChanger(background) {
    // Define  arrays
    const array1 = ["Sunny1"];
    const array2 = ["Clear0"];
    const array3 = ["Fog1", "Freezing fog1", "Mist1"];
    const array4 = ["Fog0", "Freezing fog0", "Mist0"];
    const array5 = ["Cloudy1", "Partly cloudy1"];
    const array6 = ["Cloudy0", "Partly cloudy0"];
    const array7 = ["Overcast1", "Patchy rain possible1", "Patchy sleet possible1", "Light rain1"];
    const array8 = ["Overcast0", "Patchy rain possible0", "Patchy sleet possible0", "Light rain0"];
    const array9 = ["Patchy snow possible1", "Patchy freezing drizzle possible1", "Patchy light snow1", "Light snow1", "Patchy moderate snow1"];
    const array10 = ["Patchy snow possible0", "Patchy freezing drizzle possible0", "Patchy light snow0", "Light snow0", "Patchy moderate snow0"];
    const array11 = ["Thundery outbreaks possible1", "Patchy light rain with thunder1", "Moderate or heavy rain with thunder1"];
    const array12 = ["Thundery outbreaks possible0", "Patchy light rain with thunder0", "Moderate or heavy rain with thunder0"];
    const array13 = ["Blowing snow1", "Blizzard1", "Moderate snow1", "Patchy heavy snow1", "Heavy snow1", "Ice pellets1", "Patchy light snow with thunder1"];
    const array14 = ["Blowing snow0", "Blizzard0", "Moderate snow0", "Patchy heavy snow0", "Heavy snow0", "Ice pellets0", "Patchy light snow with thunder0"];
    const array15 = ["Patchy light drizzle1", "Light drizzle1", "Freezing drizzle1", "Heavy freezing drizzle1", "Patchy light rain1"];
    const array16 = ["Patchy light drizzle0", "Light drizzle0", "Freezing drizzle0", "Heavy freezing drizzle0", "Patchy light rain0"];
    const array17 = ["Moderate rain at times1", "Moderate rain1", "Heavy rain at times1", "Heavy rain1", "Light freezing rain1", "Moderate or heavy freezing rain1", "Light sleet1", "Moderate or heavy sleet1"];
    const array18 = ["Moderate rain at times0", "Moderate rain0", "Heavy rain at times0", "Heavy rain0", "Light freezing rain0", "Moderate or heavy freezing rain0", "Light sleet0", "Moderate or heavy sleet0"];
    const array19 = ["Light rain shower1", "Moderate or heavy rain shower1", "Torrential rain shower1", "Light sleet showers1", "Moderate or heavy sleet showers1"];
    const array20 = ["Light rain shower0", "Moderate or heavy rain shower0", "Torrential rain shower0", "Light sleet showers0", "Moderate or heavy sleet showers0"];
    const array21 = ["Light snow showers1", "Moderate or heavy snow showers1", "Light showers of ice pellets1", "Moderate or heavy showers of ice pellets1", "Moderate or heavy snow with thunder1"];
    const array22 = ["Light snow showers0", "Moderate or heavy snow showers0", "Light showers of ice pellets0", "Moderate or heavy showers of ice pellets0", "Moderate or heavy snow with thunder0"];



    const searchString = background;
    const foundInArrays = findStringInArrays(searchString, array1, array2, array3, array4, array5, array6, array7, array8, array9, array10, array11, array12, array13, array14, array15, array16, array17, array18, array19, array20, array21, array22);

    if (foundInArrays) {
        // console.log(`${searchString} is found in: ${foundInArrays.join(", ")}`);
        if (foundInArrays.join(", ") == 'Array 1') {
            document.body.style.backgroundImage = "url(assets/images/background/sunny.jpg)";
        }
        if (foundInArrays.join(", ") == 'Array 2') {
            document.body.style.backgroundImage = "url(assets/images/background/clear.jpg)";
        }
        if (foundInArrays.join(", ") == 'Array 3') {
            document.body.style.backgroundImage = " url(assets/images/background/foggyday.jpg)";
        }
        if (foundInArrays.join(", ") == 'Array 4') {
            document.body.style.backgroundImage = "url(assets/images/background/foggynight.jpg)";
        }
        if (foundInArrays.join(", ") == 'Array 5') {
            document.body.style.backgroundImage = "url(assets/images/background/cloudyday.jpg)";
        }
        if (foundInArrays.join(", ") == 'Array 6') {
            document.body.style.backgroundImage = "url(assets/images/background/cloudyNight.jpg)";
        }
        if (foundInArrays.join(", ") == 'Array 7') {
            document.body.style.backgroundImage = "url(assets/images/background/ovarcastday.jpg)";
        }
        if (foundInArrays.join(", ") == 'Array 8') {
            document.body.style.backgroundImage = "url(assets/images/background/ovarcastnight.jpg)";
        }
        if (foundInArrays.join(", ") == 'Array 9') {
            document.body.style.backgroundImage = "url(assets/images/background/snowday.jpg)";
        }
        if (foundInArrays.join(", ") == 'Array 10') {
            document.body.style.backgroundImage = "url(assets/images/background/snownight.jpg)";
        }
        if (foundInArrays.join(", ") == 'Array 11') {
            document.body.style.backgroundImage = "url(assets/images/background/thunderday.jpg)";
        }
        if (foundInArrays.join(", ") == 'Array 12') {
            document.body.style.backgroundImage = "url(assets/images/background/thundernight.jpg)";
        }
        if (foundInArrays.join(", ") == 'Array 13') {
            document.body.style.backgroundImage = "url(assets/images/background/snowfallDay.jpg)";
        }
        if (foundInArrays.join(", ") == 'Array 14') {
            document.body.style.backgroundImage = "url(assets/images/background/snowfallNight.jpg)";
        }
        if (foundInArrays.join(", ") == 'Array 15') {
            document.body.style.backgroundImage = "url(assets/images/background/rainDay.jpg)";
        }
        if (foundInArrays.join(", ") == 'Array 16') {
            document.body.style.backgroundImage = "url(assets/images/background/rainNight.jpg)";
        }
        if (foundInArrays.join(", ") == 'Array 17') {
            document.body.style.backgroundImage = "url(assets/images/background/rainyDay.jpg)";
        }
        if (foundInArrays.join(", ") == 'Array 18') {
            document.body.style.backgroundImage = "url(assets/images/background/rainyNight.jpg)";
        }
        if (foundInArrays.join(", ") == 'Array 19') {
            document.body.style.backgroundImage = "url(assets/images/background/rainshowerday.jpg)";
        }
        if (foundInArrays.join(", ") == 'Array 20') {
            document.body.style.backgroundImage = "url(assets/images/background/rainshowernight.jpg)";
        }
        if (foundInArrays.join(", ") == 'Array 21') {
            document.body.style.backgroundImage = "url(assets/images/background/snowsday.jpg)";
        }
        if (foundInArrays.join(", ") == 'Array 22') {
            document.body.style.backgroundImage = "url(assets/images/background/snowsnight.jpg)";
        }


    } else {
        console.log(`${searchString} is not found in any array`);
    }
}


// Function to check if a string exists in any of the arrays
function findStringInArrays(searchString, ...arrays) {
    const foundInArrays = arrays.map((array, index) => {
        if (array.includes(searchString)) {
            return `Array ${index + 1}`;
        }
        return null;
    }).filter(Boolean); // Remove null values

    return foundInArrays.length ? foundInArrays : null;
}