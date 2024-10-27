import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Clock from 'react-live-clock';
import toast, { Toaster } from 'react-hot-toast';
import clearsky from '../src/assets/clearsky.jpg';
import clouds from '../src/assets/clouds.jpg';
import dust from '../src/assets/dust.jpg';
import haze from '../src/assets/haze.jpg';
import rain from '../src/assets/rain.jpg';
import sunny from '../src/assets/sunny.jpg';

function App() {
  const [data, setData] = useState({})
  const [location, setLocation] = useState('')
  const [loading,setLoading] = useState(true)

  
  const searchLocation = async (event) => {
    if (event.key === 'Enter') {
      try{
          setLoading(true)
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${process.env.REACT_APP_API_KEY}`)
          setData(response.data)
      }
      catch(e){
toast.error('Please enter valid city.')
      }
     
      setLocation('')
    }
    setLoading(false)
  }
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(async function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
       const resp=await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_API_KEY}&units=imperial`)
       
       setData(resp.data)
       setLoading(false)
    });
    
  },[])
  function kelvinToCelsius(fahrenheit) {
    return (fahrenheit - 32) / 1.8;
  }
  function date(timestamp){
    const date = new Date(timestamp * 1000); 

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); 
    const day = ('0' + date.getDate()).slice(-2);
    
    const dayOfWeek = weekdays[date.getDay()];
    
    return (
      <div>
        {`${year}-${month}-${day} (${dayOfWeek}) `}
        <Clock format={'HH:mm:ss'} ticking={true} timezone={'Asia/Kolkata'} noSsr={true} />
      </div>
    );
  
  }
  const backgroundImage =
  data &&
  data.weather &&
  data.weather.length > 0 &&
  (() => {
    const weatherCondition = data.weather[0].main.toLowerCase();
    switch (weatherCondition) {
      case 'clear sky':
        return `url(${clearsky})`;
      case 'few clouds':
      case 'clouds':
      case 'scattered clouds':
      case 'broken clouds':
        return `url(${clouds})`;
      case 'shower rain':
      case 'rain':
        return `url(${rain})`;
      case 'mist':
        return `url(${haze})`;
      case 'dust':
        return `url(${dust})`;
      default:
        return `url(${sunny})`;
    }
  })(); 
   var style = {
    backgroundImage: backgroundImage,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className="app" style={style} >
            <Toaster />
      {
        loading && 
        <div className='spinner'> 
        <img src='./loading.gif' height='200px' />
        </div>
      }
      <div className="search">
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder='Enter Location'
          type="text" />
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ?<div className='box'> <h1>{kelvinToCelsius(data.main.temp).toFixed()}°C</h1> <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} /> </div>: null}
            <div className='dt'>{date(data.dt)}</div>
          </div>
      
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>

        {data.name !== undefined &&
          <div className="bottom">
            <div className="feels">
              {data.main ? <p className='bold'>{kelvinToCelsius(data.main.feels_like).toFixed()}°C</p> : null}
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? <p className='bold'>{data.wind.speed.toFixed()} MPH</p> : null}
              <p>Wind Speed</p>
            </div>
          </div>
        }



      </div>
    </div>
  );
}

export default App;