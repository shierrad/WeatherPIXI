
function getCurrentInfo(weatherData){
    let wD = weatherData.weather[0].description;
    const currWea = wD.charAt(0).toUpperCase() + wD.slice(1);  
    const currIcon = weatherData.weather[0].icon;
    const currTemp = weatherData.main.temp.toFixed(1);
    const currFeels = weatherData.main.feels_like.toFixed(1);
    const place = `${weatherData.name}, ${weatherData.sys.country}`;
    return {currWea: currWea, currTemp: currTemp, currFeels: currFeels, currIcon: currIcon, place: place};
}


function getDateInfo(dateString, timeString, timeZone){
    let year =  Number(dateString.split("-")[0])
    let month = dateString.split("-")[1];
    month = month[0] === "0" ? Number(month[1]) : Number(month);
    let day = dateString.split("-")[2];
    day = day[0] === "0" ? Number(day[1]) : Number(day);
    let hour = timeString.split(":")[0]
    hour = hour[0] === "0" ? Number(hour[1])+timeZone : Number(hour) + timeZone; 
    if (hour < 0) {
        day += -1;
        hour = 24 + hour;
    } else if (hour >= 24){
        day += 1
        hour = hour - 24
    }
    if (day > 30 && [4,6,9,11].includes(month)){
        day = 1;
        month += 1;
    } else if (day > 31 && [1,3,5,7,8,10,12].includes(month)){
        year = month === 12 ? year + 1 : year;
        day = 1;
        month = month === 12 ? 1 : month+1;
    } else if (month === 2) {
        if ( (year - 2000) % 4 === 0){
            if ((day ) > 29) {``
                day = 1;
                month = 3;
            }
        } else {
            if ((day ) > 28){
                day = 1;
                month = 3;
            }
        }
    }
     hour > 0 ?  hour : (24 + hour);
    if (day == 0){ console.log(dateString, timeString)}
    return {year: year, month: month, day: day, hour: hour}
}

function getForecastData(dataList, timeZone){
    let hourlyForecasts = {
        hour : [],
        weather : [],
        temp : [],
        icon : []
    }
    let forecastData = {
        date : [],
        forecasts : []
    }
    //let j = 0;
    let dateString = dataList[0].dt_txt.split(" ")[0]
    let timeString = dataList[0].dt_txt.split(" ")[1]
    let firstDate = getDateInfo(dateString, timeString, timeZone);
    let cDay = firstDate.day;
    let cMonth = firstDate.month;
    for (let i = 0; i < dataList.length; i++){
        let dateString = dataList[i].dt_txt.split(" ")[0];
        let timeString = dataList[i].dt_txt.split(" ")[1];   
        let cDate = getDateInfo(dateString, timeString, timeZone);
        if (cDay != cDate.day && cDate.day != 0) {
            forecastData.date.push({month: cMonth, day: cDay});
            forecastData.forecasts.push(hourlyForecasts);
            hourlyForecasts = {hour:[], weather:[],
                               temp: [], icon:[]}
            cDay = cDate.day;
            cMonth = cDate.month;
        }
        let wD = dataList[i].weather[0].description
        let weatherDescription = wD.charAt(0).toUpperCase() + wD.slice(1);
        hourlyForecasts.hour.push(cDate.hour) 
        hourlyForecasts.weather.push(weatherDescription);
        hourlyForecasts.temp.push(dataList[i].main.temp.toFixed(1));
        hourlyForecasts.icon.push(dataList[i].weather[0].icon);
    }
    forecastData.date.push({month: cMonth, day: cDay});
    forecastData.forecasts.push(hourlyForecasts);
    //console.log(forecastData.forecasts[0]);
    let missingFirstHours = 8 - forecastData.forecasts[0].hour.length;
    //console.log(missingFirstHours);
    let firstHour = forecastData.forecasts[0].hour[0]
    for (let i = 0 ; i < missingFirstHours ;  i++){
        forecastData.forecasts[0].hour.unshift(firstHour - 3*(i+1));
        forecastData.forecasts[0].weather.unshift("");
        forecastData.forecasts[0].temp.unshift("");
        forecastData.forecasts[0].icon.unshift("");
    }
    //console.log(forecastData.forecasts[0].hour);
    let lastDayIndex = forecastData.forecasts.length - 1 
    let nLastHours = forecastData.forecasts[lastDayIndex].hour.length;
    let missingLastHours = 8 - nLastHours;
    let lastHour = forecastData.forecasts[lastDayIndex].hour[nLastHours-1]
    for (let i = 0; i < missingLastHours; i++){
        forecastData.forecasts[lastDayIndex].hour.push(lastHour + 3*(i+1));
        forecastData.forecasts[lastDayIndex].weather.push("");
        forecastData.forecasts[lastDayIndex].temp.push("");
        forecastData.forecasts[lastDayIndex].icon.push("");
    }
    return forecastData;
}

export {getCurrentInfo, getDateInfo, getForecastData};
