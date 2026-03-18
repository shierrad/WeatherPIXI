import {thunder, rain, snow, clear, bclouds, sclouds, fclouds, srain, mist, wait} from './weather.js';


//console.log(current, forecast);

let scene;
let weather = current.currWea ? current.currWea : "wait"

if (weather.includes("clouds")){
    switch (weather.split(" ")[0]){
        case "Overcast" :
            scene = "bclouds";
            break;
        case "Broken" :
            scene = "bclouds";
            break;
        case "Few":
            scene = "fclouds";
            break;
        case "Scattered":
            scene = "sclouds"
            break;
        default:
            scene = "bclouds"
    }
}

if (weather === "Clear sky"){
    scene = "clear";
}

if (weather.includes("rain") || weather.includes("Rain")){
    if (weather === "Shower rain"){
        scene = "srain";
    } else if (weather === "Rain"){
        scene = "rain";
    } else {
        scene = "rain";
    }
}

if (weather.includes("thunder") || weather.includes("Thunder")){
    scene ="thunder";
}

if (weather.includes("Haze") || weather.includes("haze")){
    scene = "mist";
}

if (weather.includes("Mist") || weather.includes("mist")){
    scene = "mist";
}

if (weather.includes("Smoke") || weather.includes("smoke")){
    scence = "mist";
}

if (weather.includes("Fog") || weather.includes("fog")){
    scene = "mist"
}

if (weather.includes("Sand") || weather.includes("sand")){
    scene = "mist"
}

if (weather.includes("Dust") || weather.includes("dust")){
    scene = "mist"
}

if (weather.includes("Ash") || weather.includes("ash")){
    scene = "mist"
}

if (weather.includes("Squall") || weather.includes("squall")){
    scene = "mist"
}

if (weather.includes("Fog") || weather.includes("fog")){
    scene = "mist"
}


if (weather.includes("Snow") || weather.includes("snow")){
    scene = "snow";
}

if (!scene){
    scene = "wait";
}



//const weather = "fclouds";

if (scene === "wait"){
    wait();
}

if (scene === "thunder"){
    thunder();
}
if (scene === "rain"){
    rain();
}

if (scene === "snow"){
    snow();
}

if (scene === "clear"){
    clear();
}

if (scene === "bclouds"){
    bclouds();
}

if (scene === "sclouds"){
    sclouds();
}

if (scene == "fclouds"){
    fclouds();
}

if (scene === "srain"){
    srain();
}

if (scene === "mist"){
    mist();
}



