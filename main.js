async function fetchLocation(location) {

    const API_KEY = 'AP3594QDXZX4VY4XWT83T9GL3';
    try{

    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&include=days%2Ccurrent%2Chours&key=${API_KEY}&contentType=json`)
    
    if(!response.ok){
        const text = await response.text(); // 👈 access server message
        throw new Error(text || `HTTP ${response.status}`)
    }

    else{
    
    const data = await response.json();


    let errorField = document.querySelector('.error');
    errorField.textContent = '';

    let container = document.querySelector('.container');
    container.innerHTML = '';

    handleCurrentWeather(data.currentConditions,data.address);
    handleTodayHours(data.days[0].hours);
    handleFutureDays(data.days.slice(1,8));

    }
    }

    catch(error){


    let container = document.querySelector('.container');
    container.textContent = '';

    let errorField = document.querySelector('.error');
    errorField.textContent = error.message;
    }

}

function handleCurrentWeather(data,address){

    handleWeather(data,address);
    handleAirConditions(data);

}

function handleWeather(data,address){
    let dict = {
        'precipprob':'',
        'temp':''
    }
    console.log(data)
    for(let key in dict){
        //console.log(data[key])
        dict[key] = data[key];
    }

    let newDict = {'address':address.charAt(0).toUpperCase() + address.slice(1),
        ...dict
    }

    displayWeather(newDict,data['icon']);
}

function handleAirConditions(data){

    let dict = {"sunrise":"",
        "sunset":'',
        "humidity":"%",
        "windspeed":'km/h'
    }

    for(let key in dict){
        dict[key] = data[key]+dict[key];
    }

    displayAirConditions(dict);

}

function handleTodayHours(data){
    let info = []

    for(let counter = 0;counter<24;counter+=3){
        let hour = {
        datetime: data[counter].datetime.slice(0,5),
        icon: data[counter].icon,
        temp: data[counter].temp,
    };
       info.push(hour)
    }

    displayTodayHours(info);
}

function getDayOfTheWeek(date){

    const myDate = new Date(date);
    const dayOfWeekNumber = myDate.getDay();

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[dayOfWeekNumber];

    return dayName;

}

function handleFutureDays(days){

    const data = [];

    for(let day in days){
        let info = {
            dayname : getDayOfTheWeek(days[day].datetime),
            icon : days[day].icon,
            tempmin : days[day].tempmin,
            tempmax : days[day].tempmax,
        }
        data.push(info)
    }

    displayFutureDays(data);
}

function getWeatherIcon(desc) {
  const d = desc.toLowerCase();

  if (d.includes("thunder")) return "⛈️";
  if (d.includes("snow")) return "❄️";
  if (d.includes("rain")) return "🌧️";
  if (d.includes("fog") || d.includes("mist")) return "🌫️";
  if (d.includes("wind")) return "💨";
  if (d.includes("overcast") || d.includes("cloudy")) return "☁️";
  if (d.includes("clear") || d.includes("sunny")) return "☀️";

  return desc;
}


function displayWeather(data,icon){

    //console.log(icon);
    let weatherCard = document.createElement('div');
    weatherCard.classList.add('weatherCard');

    let weatherSection = document.createElement('div');
    weatherSection.classList.add('weatherSection');

    for(let key in data){
        let field = document.createElement('p');
        console.log(data[key])
        if(key=='precipprob'){
            field.textContent = `Chance of Rainfall: ${data[key]}%`
        }
        
        else if(key=='temp'){
            field.textContent = handleTemperatureOnFetch(data[key]);
            field.classList.add('temp');
        }
        else{
            field.textContent = data[key];
        }

        weatherSection.append(field)
    }

    let iconSection = document.createElement('div');
    iconSection.textContent = getWeatherIcon(icon);
    iconSection.classList.add('icon');

    weatherCard.append(weatherSection,iconSection);
    let container = document.querySelector('.container');
    container.append(weatherCard);
    
}

function displayAirConditions(data){
    let airCard = document.createElement('div');
    airCard.classList.add('airCard');

    let airIcons = {
  sunrise: "<svg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' ><g id='SVGRepo_bgCarrier' stroke-width='0'></g><g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g><g id='SVGRepo_iconCarrier'><path fill='rgb(77, 77, 77)' d='M32 768h960a32 32 0 1 1 0 64H32a32 32 0 1 1 0-64zm129.408-96a352 352 0 0 1 701.184 0h-64.32a288 288 0 0 0-572.544 0h-64.32zM512 128a32 32 0 0 1 32 32v96a32 32 0 0 1-64 0v-96a32 32 0 0 1 32-32zm407.296 168.704a32 32 0 0 1 0 45.248l-67.84 67.84a32 32 0 1 1-45.248-45.248l67.84-67.84a32 32 0 0 1 45.248 0zm-814.592 0a32 32 0 0 1 45.248 0l67.84 67.84a32 32 0 1 1-45.248 45.248l-67.84-67.84a32 32 0 0 1 0-45.248z'></path></g></svg>",

  sunset: "<svg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' ><g id='SVGRepo_bgCarrier' stroke-width='0'></g><g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g><g id='SVGRepo_iconCarrier'><path fill='rgb(77, 77, 77)' d='M82.56 640a448 448 0 1 1 858.88 0h-67.2a384 384 0 1 0-724.288 0H82.56zM32 704h960q32 0 32 32t-32 32H32q-32 0-32-32t32-32zm256 128h448q32 0 32 32t-32 32H288q-32 0-32-32t32-32z'></path></g></svg>",

  humidity: "<svg viewBox='0 0 24 24'  xmlns='http://www.w3.org/2000/svg'><g id='SVGRepo_bgCarrier' stroke-width='0'></g><g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g><g id='SVGRepo_iconCarrier'><path d='M12 21.5C16.1012 21.5 19.5 18.4372 19.5 14.5714C19.5 12.1555 18.2672 9.71249 16.8732 7.70906C15.4698 5.69214 13.8515 4.04821 12.9778 3.21778C12.4263 2.69364 11.5737 2.69364 11.0222 3.21779C10.1485 4.04821 8.53016 5.69214 7.1268 7.70906C5.73282 9.71249 4.5 12.1555 4.5 14.5714C4.5 18.4372 7.8988 21.5 12 21.5Z' stroke='rgb(77, 77, 77)'></path><path d='M12 18C11.4747 18 10.9546 17.8965 10.4693 17.6955C9.98396 17.4945 9.54301 17.1999 9.17157 16.8284C8.80014 16.457 8.5055 16.016 8.30448 15.5307C8.10346 15.0454 8 14.5253 8 14' stroke='rgb(77, 77, 77)' stroke-linecap='round'></path></g></svg>",

  windspeed: "<svg viewBox='0 0 24 24'  xmlns='http://www.w3.org/2000/svg'><g id='SVGRepo_bgCarrier' stroke-width='0'></g><g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g><g id='SVGRepo_iconCarrier'><path d='M15.7639 7C16.3132 6.38625 17.1115 6 18 6C19.6569 6 21 7.34315 21 9C21 10.6569 19.6569 12 18 12H3M8.50926 4.66667C8.87548 4.2575 9.40767 4 10 4C11.1046 4 12 4.89543 12 6C12 7.10457 11.1046 8 10 8H3M11.5093 19.3333C11.8755 19.7425 12.4077 20 13 20C14.1046 20 15 19.1046 15 18C15 16.8954 14.1046 16 13 16H3' stroke='rgb(77, 77, 77)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'></path></g></svg>"
};

    for(let key in data){

        let box = document.createElement('div');

        let field =  document.createElement('p');
        field.textContent = data[key];

        let title = document.createElement('p');
        title.innerHTML = airIcons[key]+key;
        title.classList.add("airCond-title");

        box.append(title,field)
        airCard.append(box);
    }

    let container = document.querySelector('.container');
    container.append(airCard);

}


function displayTodayHours(data){
    
    let weatherArea = document.createElement('div');
    weatherArea.classList.add('weatherArea');


    for(let hour of data){
        let hourArea = document.createElement('div');
        hourArea.classList.add('hourArea');
        
        for(let key in hour){
            let field = document.createElement('p');
            let content = hour[key];
            if(key=='icon'){
                field.textContent = getWeatherIcon(content);
                field.classList.add('icon');
            }

            else if(key=='temp'){
                field.textContent = handleTemperatureOnFetch(content);
                field.classList.add('temp');
            }
            else{
                field.textContent = content;
            }
            hourArea.append(field)
        }

        weatherArea.append(hourArea);
    }
    
    let container = document.querySelector('.container');
    container.append(weatherArea);

}

function displayFutureDays(days){
    let futureWeather = document.createElement('div');
    futureWeather.classList.add('futureWeather');

    for(let day of days){
        let dayWeather = document.createElement('div');
        dayWeather.classList.add('dayWeather');
        
        for(let key in day){
            let field = document.createElement('p');
            let content = day[key];

            if(key=='icon'){
                field.textContent = getWeatherIcon(content);
                field.classList.add('icon');
            }

            else if(key.startsWith('temp')){
                field.textContent = handleTemperatureOnFetch(content);
                field.classList.add('temp');

            }

            else{field.textContent = content;}
            dayWeather.append(field)
        }

        futureWeather.append(dayWeather);

    }

    let container = document.querySelector('.container');
    container.append(futureWeather);

}


const searchBox = document.querySelector('#search');
searchBox.addEventListener('click',()=>{

    const query = document.querySelector('#query').value;
    fetchLocation(query);

})

let currTemp = 'f';

const fTemp = document.querySelector('#temp1');
fTemp.addEventListener('click',()=>{
    changeTemperature('f');
})

const cTemp = document.querySelector('#temp2');
cTemp.addEventListener('click',()=>{
    changeTemperature('c');
})

function convertTemperatures(temp){
    if(currTemp=='c'){
        return `${((temp-32)/1.8).toFixed(1)}°C`;
    }

    else{
        return `${(temp*1.8+32).toFixed(1)}°F`;
    }

}

function handleTemperatureOnFetch(temp){
    if(currTemp=='c'){
        return `${((temp-32)/1.8).toFixed(1)}°C`;
    }

    return `${(temp)}°F`
}

function changeTemperature(mode){
    let temps = document.querySelectorAll('.temp');
    if(mode!=currTemp){
    currTemp = mode;
    
    for(let temp of temps){
        let oldTemp = parseFloat((temp.textContent).slice(0,-2));
        temp.textContent = convertTemperatures(oldTemp)
        
    }}
}