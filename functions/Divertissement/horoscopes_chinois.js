/* eslint-disable promise/always-return */
const variables = require('../variables');
const index = require('../index');
const cheerio = require('cheerio');
const rp = require('request-promise-native');

var datetime = new Date();
var hh = datetime.getHours()+7;
if(hh>=24) 
    hh = hh-24;

function checkDay(){
    return (hh >= 0 && hh <= 14) ? 'demain':'aujourdhui';
}
// eslint-disable-next-line consistent-return
// 
function horoscopesChinois(agent){
    var sign = agent.parameters['HoroscopesChina'];
    var horos = ['🐭', '🐮', '🐯','🐰','🐉', '🐍', '🐴', '🐐','🐵', '🐤','🐶','🐷'];
    var check = false;
    var index;
    var day = checkDay();    
    if(isNaN(sign)){
        for(var i = 0; i < 12; i++){
            if(sign === horos[i]){
                check = true;
                switch(sign){
                    case '🐵': 
                        index = 9;
                        sign = 'Singe';
                        break;
                    case '🐤':
                        index = 10;
                        sign = 'Coq';
                        break;
                    case '🐶':
                        index = 11;
                        sign ='Chien';
                        break;
                     case '🐷':
                        index = 12;
                        sign ='Cochon';
                        break;
                     case '🐭':
                        index = 3;
                        sign ='Rat';
                        break;
                     case '🐮':
                        index = 1;
                        sign ='Boeuf';
                        break;
                     case '🐯':
                        index = 6;
                        sign ='Tigre';
                        break;
                     case '🐰':
                        index = 7;
                        sign ='Lièvre';
                        break;
                     case '🐉':
                        index = 5;
                        sign ='Dragon';
                        break;
                     case '🐍':
                        index = 4;
                        sign ='Serpent';
                        break;
                     case '🐴':
                        index = 8;
                        sign ='Cheval';
                        break;
                     case '🐐':
                        index = 2;
                        sign ='Chèvre';
                        break;
                }
                //index = i+1;
                break;
            }
        }
    }
    else {
        check = true;
        var mod = sign % 12;
        switch(mod){
            case 0: 
                index = 9;
                sign = 'Singe';
                break;
            case 1:
                index = 10;
                sign = 'Coq';
                break;
            case 2:
                index = 11;
                sign ='Chien';
                break;
             case 3:
                index = 12;
                sign ='Cochon';
                break;
             case 4:
                index = 3;
                sign ='Rat';
                break;
             case 5:
                index = 1;
                sign ='Boeuf';
                break;
             case 6:
                index = 6;
                sign ='Tigre';
                break;
             case 7:
                index = 7;
                sign ='Lièvre';
                break;
             case 8:
                index = 5;
                sign ='Dragon';
                break;
             case 9:
                index = 4;
                sign ='Serpent';
                break;
             case 10:
                index = 8;
                sign ='Cheval';
                break;
             case 11:
                index = 2;
                sign ='Chèvre';
                break;
        }
    }    
    if(check !== true){
        agent.add(`Horoscope ${sign} n'est pas disponible`);
        agent.add(variables.quickRepliesTest);
        return;
    }    
    if(check === true){
        const URL = `https://www.horoscope.com/fr/horoscopes/chinois/horoscope-chinois-du-jour-${day}.aspx?signe=${index}`; // Crawl data from URL
        const getPageContent = (uri) => {
            const options = {
                uri,
                headers: {
                'User-Agent': 'Request-Promise'
                },
                transform: (body) => {
                return cheerio.load(body) // Parsing the html code
                }
            }
        
            return rp(options) // return Promise
        }        
        // eslint-disable-next-line promise/catch-or-return
        // eslint-disable-next-line consistent-return
        return getPageContent(`${URL}`).then($ => {
            //console.log($('div.view-content > ul').text())
            var text = $('div.horoscope-content > p').text();
            // var text1 = '';
            // // eslint-disable-next-line promise/always-return
            // for(var i = 0; i < 1696; i++){
                
            //     if(i > 200 && text[i] === '\n'){
            //         break;
            //     }
            //     text1 += text[i];
            // }
            agent.add(`Horoscopes ${sign}: `);
            agent.add(text);
            agent.add(variables.quickReplies2F);
        })
    }
}
module.exports = horoscopesChinois;