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

const URL = `http://www.antonyme.org/anto/${word}`; // Crawl data from URL
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
            var flag = true;
            var i = 1;
            var mot = $('div.fiche > h1').text();
            var sym; 
            var sym1 = [];
            var sym2 = '';
            console.log(mot);
            while(flag){
                sym = $(`div.fiche > ul.synos > li:nth-child(${i})`).text();
                sym1[i-1] = sym;
                //sym1[i-1] = sym1[i-1].replace('\n','');
                //sym1[i-1] = sym1[i-1].replace('\n','');
                
                //console.log(sym);
                
                if(sym){
                    i++;    
                }else flag = false;
            }
            console.log(`There are ${sym1.length-1} syms`);
            for(var j = 0; j < sym1.length-1; j++){
                sym1[j] = sym1[j].trim();
                sym2 += `[${j+1}]`;
                sym2 += sym1[j];
                sym2 += '  ';
                //console.log(sym1[j]);
            }
           //console.log(sym1);
           console.log(sym2);
            
            // for(var j = 1; j <= count; j++){
            //     sym = $(`div.fiche > ul.synos > li:nth-child(${j})`).text();
            //     // if(sym === ' '){
            //     //     continue;
            //     // }
            //     //sym1 += sym[j];
            //     //console.log(sym1[i]);
            // }
            //agent.add(`Définition ${word}: `);
            // eslint-disable-next-line prefer-arrow-callback
           
            //console.log(sym);
        });