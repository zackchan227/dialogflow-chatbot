const rp = require('request-promise-native');
const cheerio = require('cheerio');

var datetime = new Date();
var hh = datetime.getHours()+7;
if(hh>=24) 
    hh = hh-24;

function checkDay(){
    return (hh >= 0 && hh <= 14) ? 'demain':'aujourdhui';
}
// eslint-disable-next-line consistent-return
// 

const check = true;
const day = checkDay();
    if(check === true){
        const URL = `https://www.horoscope.com/fr/horoscopes/chinois/horoscope-chinois-du-jour-aujourdhui.aspx?signe=10`; // Crawl data from URL
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
            console.log(text);
            // agent.add(`Horoscopes ${sign}: `);
            // agent.add(text1);
            //agent.add(variables.quickReplies2F);
        })
    }