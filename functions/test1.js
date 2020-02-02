var rp = require('request-promise-native');
var cheerio = require('cheerio');
var index = 1;
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
                var text = $('div.horoscope-content > p').text();
                // agent.add(`Horoscopes ${sign}: `);
                // agent.add(text);
                // agent.add(quickRepliesTest);
                console.log(text);
            })