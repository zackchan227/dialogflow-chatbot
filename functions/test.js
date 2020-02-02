/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
var rp = require('request-promise-native');
var cheerio = require('cheerio');
var word = 'quelque';
var align = require('align-text');
 

const URL = `https://www.le-dictionnaire.com/definition/${word}`; // Crawl data from URL
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

            

        getPageContent(`${URL}`).then($ => {
            //console.log($('div.view-content > ul').text())
            var def = $('div.row > div.col-xs-12 col-sm-6 col-md-5 col-lg-5 > h3').text();
            var text = $('div.defbox > ul').text();
            var mot = $('div.defbox > span').text();
            align(text, 10);
            //console.log(mot);
            console.log(align(text, 40));
            // agent.add(`Définition ${mot}: `);
            // agent.add(text);
            // agent.add(quickReplies2F);
        })