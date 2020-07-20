var datetime = new Date();
var hh = datetime.getHours();
function checkDay(){
    var day;
    return  day = (hh >= 0 && hh <= 14) ? 'demain' :  'aujourdhui';
}

var day = checkDay();
console.log(hh);
console.log(day);