/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
const rp = require('request-promise-native');
const cheerio = require('cheerio');

function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
}

var word = 'chercher';

        const URL = `https://crisco2.unicaen.fr/des/synonymes/${word}`; // Crawl data from URL
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
            var flag = true;
            var i,index,syms;
            //var num = $('#synonymes > div:nth-child(1) > i').text();
            var sym; 
            var sym1 = [];
            var sym2 = '';
            var an2,an1,an,a,ran,max;
            // eslint-disable-next-line no-empty
            for(index = 2; index < 300; index++){
                an = $(`#synonymes > a:nth-child(${index})`).text();
                an1 = $(`#synonymes > div:nth-child(${index}) > i`).text();
                if(!isNaN(parseInt(an1))) {
                    //console.log(an1);
                    i = index+1;
                    syms = i-1;
                    break;
                }
                if(index > 269){
                     flag = false;
                     break;
                }
            }

            while(flag){
                sym = $(`#synonymes > a:nth-child(${i})`).text();
                sym1[i-syms-1] = sym;                
                if(sym){
                    i++;    
                }else flag = false;
            }

            max = sym1.length;
            console.log(max);
            //console.log(sym1);
            //console.log(sym1.length);
            // for(var j = 0; j < sym1.length-1; j++){
            //     sym1[j] = sym1[j].trim();
            //     sym2 += `[${j+1}] `;
            //     sym2 += sym1[j];
            //     sym2 += '  ';
            // }
            if(sym1.length > 0 && sym1.length <= 10){
                for(var j = 0; j < sym1.length-1; j++){
                    sym1[j] = sym1[j].trim();
                    sym2 += `[${j+1}] `;
                    sym2 += sym1[j];
                    sym2 += '\n';
                }
            }else if(sym1.length > 10){
                for(j = 0; j < sym1.length-1; j++){
                    ran = randomInt(j,max);
                    sym1[ran] = sym1[ran].trim();
                    sym2 += `[${j+1}] `;
                    sym2 += sym1[ran];
                    sym2 += '\n';
                }
            }
            else console.log(sym1.length);

            //console.log(sym2.length);

            //agent.add(`${mot}`);
            //agent.add(`Il y a ${sym1.length-1} synonymes`);
            //agent.add(`${sym2}`);
            console.log(sym2);
            
        }); 