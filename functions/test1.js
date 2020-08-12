// var datetime = new Date();
// var hh = datetime.getHours();
// function checkDay(){
//     var day;
//     return  day = (hh >= 0 && hh <= 14) ? 'demain' :  'aujourdhui';
// }

// var day = checkDay();
// console.log(hh);
// console.log(day);

function resolveAfter2Seconds(x) { 
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, 5000);
    });
  }
  
  async function f1() {
    var x = await resolveAfter2Seconds(10);
    console.log(x); // 10
  }
  
  f1();