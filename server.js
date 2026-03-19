import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
//import session from 'express-session';
import dotenv from "dotenv";
import {getCurrentInfo, getDateInfo, getForecastData} from "./weatherUtils.js";

dotenv.config();

const debug = false;

const log = (...args) => debug && console.log(...args);

//// ////

const app = express();
const PORT = process.env.PORT || 3000;

const API_VERSION = "2.5"
let apiKey;
if (API_VERSION === "3.0"){
 apiKey = process.env.OPENWEATHER_KEY_30;
}
if (API_VERSION === "2.5") {
 apiKey = process.env.OPENWEATHER_KEY_25;
}


log(`Using API version ${API_VERSION}`);


const WEA_API_URL = "https://api.openweathermap.org/data/" + API_VERSION;


app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

//app.use(session({
//    secret: 'super-secret-key',
//    resave: false,
//    saveUninitialized: true
//}));


let lastCallTime = 0;
const MIN_INTERVAL = 5000; // 5 seconds

app.use("/weather", (req, res, next) => {
  const now = Date.now();

  if (now - lastCallTime < MIN_INTERVAL) {
    return res.status(429).render("index.ejs", {current: "Too many requests, wait a few seconds", forecast: false});

   // return res.status(429).send("Too many requests, wait a few seconds");
    }

  lastCallTime = now;
  next();
});


app.get("/", (req, res) => {
    //if (!req.session.current){
    //    req.session.current = false;
    //}
    res.render("index.ejs", {current: `Get the weather for your city!`,
                             forecast: false});
});


app.post("/weather", async (req, res) =>{
    //if (!req.session.state){
    //    req.session.state = {x: 100};
    //}
    const city = req.body.city;
    if (city.length < 1) {
        res.render("index.ejs", {current: `Get the weather for your city!`,
                                     forecast: false} );
    } else {
    const FOR_URL = `${WEA_API_URL}/forecast?q=${city}&units=metric&appid=${apiKey}`
    const WEA_URL = `${WEA_API_URL}/weather?q=${city}&units=metric&appid=${apiKey}`
    try {
        const forecastResult = await axios.get(FOR_URL);
        const weatherResult = await axios.get(WEA_URL);
        log(forecastResult);
        log(weatherResult);
        const currData = getCurrentInfo(weatherResult.data)
        let timeZone = weatherResult.data.timezone / 3600;
        let forecastData = getForecastData(forecastResult.data.list, timeZone); 
        log(forecastData);
        res.render("index.ejs", {current: currData, forecast: forecastData});
    } catch (error) {
        res.render("index.ejs", {current: `City name "${city}" not found, please try again`,
                                     forecast: false} );
        log(error);
    } 
    }
}) 


app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})


