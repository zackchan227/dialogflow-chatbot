var rp = require('request-promise-native');
var cheerio = require('cheerio');
var index = 12;
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
const URL = `https://www.horoscope.com/fr/horoscopes/general/horoscope-general-du-jour-aujourdhui.aspx?signe=${index}`; // Crawl data from URL
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
             getPageContent(`${URL}`).then($ => {
                //console.log($('div.view-content > ul').text())
                var text = $('body > div.wrap > section.main-horoscope > div > div > div.span-7.span-sm-12.span-xs-12.col > div.horoscope-content > p').text();
                // agent.add(`Horoscopes ${sign}: `);
                // agent.add(text);
                // agent.add(quickRepliesTest);
                //console.log(text);
                var text1 = '';
                for(var i = 0; i < 999; i++){
                    
                    if(i > 200 && text[i] === '\n'){
                        break;
                    }
                    text1 += text[i];
                }
                console.log(text1);
            })