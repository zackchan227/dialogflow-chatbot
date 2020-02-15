/* eslint-disable no-empty */
/* eslint-disable no-implicit-coercion */
/* eslint-disable no-unreachable */
/* eslint-disable promise/always-return */
const rp = require('request-promise-native');
const cheerio = require('cheerio');

function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
}

var word = 'trouver';

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

            
        // eslint-disable-next-line promise/catch-or-return
        // eslint-disable-next-line consistent-return
        return getPageContent(`${URL}`).then($ => {
            //console.log($('div.view-content > ul').text())
            console.log(`Définition ${word}: `);
            var text;
            var i = 2,j = 1, k = 0;
            var flag = true;
            var mot = $('div.defbox > span').text();
            var text1 = [];
            var text2 = '';
            while(flag){
                text = $(`div.defbox > ul:nth-child(${i}) > li:nth-child(${j})`).text();
                //console.log(`${text}`);
                console.log(text);
                text1[k] = text;       
                k++; 
                if(text){
                    j++;
                    text = $(`div.defbox > ul:nth-child(${i}) > li:nth-child(${j})`).text();
                    if(!text){
                        i++;
                        j = 1;
                    }
                }else flag = false;
            }
            console.log(text1.length-1);
            
            for(j = 0; j < text1.length-1; j++){
               
                text1[j] = text1[j].trim();
                //console.log(text1);
                text2 += `[${j+1}] `;
                text2 += text1[j];
                text2 += '\n';
            }
            console.log(`${text2}`);
            // eslint-disable-next-line prefer-arrow-callback
            
            
        })