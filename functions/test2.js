const esrever = require('esrever');

var temp = 6969;
var temp1 = temp;
var count = '0';
var score = ['','','','',''];
var score1 ='2️⃣';
var score4 ='5️⃣';
var score2 ='0️⃣';
var score3 ='0️⃣';
var score5 = '';
while(temp >= 1){
    
    temp = Math.floor(temp) / 10;
    //console.log(temp);
    
    count++;
    //console.log(count);
}

for(var i = count-1; i > 0; i--){
    var temp_unit = Math.floor(temp1) % 10;
    switch(temp_unit){
        case 0:
            score[i] += '0️⃣';
            break;
        case 1:
            score[i] += '1️⃣';
            break;
        case 2:
            score[i] += '2️⃣';
            break;
        case 3:
            score[i] += '3️⃣';
            break;
        case 4:
            score[i] += '4️⃣';
            break;
        case 5:
            score[i] += '5️⃣';
            break;
        case 6:
            score[i] += '6️⃣';
            break;
        case 7:
            score[i] += '7️⃣';
            break;
        case 8:
            score[i] += '8️⃣';
            break;
        case 9:
            score[i] += '9️⃣';
            break;
    }
    temp1 /= 10;
    console.log(temp1);
    if(temp1 < 10){
        temp1 = Math.floor(temp1) %10;
        console.log(temp1);
        switch(temp1){
            case 0:
                score[0] += '0️⃣';
                break;
            case 1:
                score[0] += '1️⃣';
                break;
            case 2:
                score[0] += '2️⃣';
                break;
            case 3:
                score[0] += '3️⃣';
                break;
            case 4:
                score[0] += '4️⃣';
                break;
            case 5:
                score[0] += '5️⃣';
                break;
            case 6:
                score[0] += '6️⃣';
                break;
            case 7:
                score[0] += '7️⃣';
                break;
            case 8:
                score[0] += '8️⃣';
                break;
            case 9:
                score[0] += '9️⃣';
                break;
        }
    }
}

//console.log(score1+score2+score4+score5+score3);
//var reversedScore = esrever.reverse(score);
console.log(score);