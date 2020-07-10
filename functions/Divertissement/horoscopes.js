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
// eslint-disable-next-line promise/always-return
function horoscopes(agent){
    var sign = agent.parameters['horoscope'];
    var horos = ['Bélier', 'Taureau', 'Gémeaux','Cancer','Lion', 'Viegre', 'Balance', 'Scorpion','Sagittaire', 'Capricorne','Verseau','Poissons'];
    var check = false;
    var index;
    var day = checkDay();

    for(var i = 0; i < 12; i++){
        if(sign === horos[i]){
            check = true;
            index = i+1;
            break;
        }
    }

    if(check !== true){
        agent.add(`Horoscope ${sign} n'est pas disponible`);
        agent.add(variables.quickRepliesTest);
        return;
    }

    if(check === true){
        const URL = `https://www.horoscope.com/fr/horoscopes/general/horoscope-general-du-jour-${day}.aspx?signe=${index}`; // Crawl data from URL
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
            var text1 = '';
            // eslint-disable-next-line promise/always-return
            for(var i = 0; i < 1696; i++){
                
                if(i > 200 && text[i] === '\n'){
                    break;
                }
                text1 += text[i];
            }
            agent.add(`Horoscopes ${sign}: `);
            agent.add(text1);
            agent.add(variables.quickReplies2F);
        })
    }
}
module.exports = horoscopes;
