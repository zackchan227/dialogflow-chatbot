/* eslint-disable no-implicit-coercion */
/* eslint-disable no-unreachable */
/* eslint-disable promise/always-return */
const rp = require('request-promise-native');
const cheerio = require('cheerio');

function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
}
var datetime = new Date();
var hh = datetime.getHours();
function checkDay(){
    var day;
    if(hh >= 0 && hh < 15){
        day = 'demain';
    }else day = 'aujourdhui'
    return day;
}


var dd = datetime.getDate();
var mm = datetime.getMonth()+1;
var day = checkDay();
console.log(day);