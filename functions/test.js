/* eslint-disable no-implicit-coercion */
/* eslint-disable no-unreachable */
/* eslint-disable promise/always-return */
const rp = require('request-promise-native');
const cheerio = require('cheerio');

function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
}
const index = randomInt(0,22) + 1;
const URL = `https://www.horoscope.com/fr/tarot/signification-de-la-carte-du-tarot.aspx?TarotCardSelectorID_numericalint=${index}`; // Crawl data from URL
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
                var text = $('div.span-9.span-xs-12.col').text();
                var text1 = '';
                for(var i = 0; i < 1696; i++){
                    
                    if(i > 200 && text[i] === '\n'){
                        break;
                    }
                    text1 += text[i];
                }
                console.log(`${index}`);
                console.log( `${text1}`);
            });