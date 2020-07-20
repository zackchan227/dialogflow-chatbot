const variables = require('../variables');

// Define the antonyms of word
function defineAntonyms(agent){
    var word = agent.parameters['word'];

    const URL = `https://crisco2.unicaen.fr/des/synonymes/${word}`; // Crawl data from URL
    const getPageContent = (uri) => {
        const options = {
            uri,
            headers: {
            'User-Agent': 'Request-Promise'
            },
            transform: (body) => {
            return variables.cheerio.load(body) // Parsing the html code
            }
         }
        
        return variables.rp(options) // return Promise
    }

    // eslint-disable-next-line promise/catch-or-return
    // eslint-disable-next-line consistent-return
    return getPageContent(`${URL}`).then($ => {
        var flag = true;
        var i,index;
        var mot = `Antonymes de ${word}`;
        var an,sym,sym1,syms,a; 
        var an1 = [];
        var an2 = '';
        var max,ran;
        
        // eslint-disable-next-line no-empty
        for(index = 2; index < 333; index++){
            sym = $(`#synonymes > a:nth-child(${index})`).text();
            sym1 = $(`#synonymes > div:nth-child(${index}) > i`).text();
            a = parseInt(sym1);
            if(!isNaN(a)) {
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
            an = $(`#synonymes > a:nth-child(${i})`).text();
            an1[i-syms-1] = an;                
            if(an){
                i++;    
            }else flag = false;
        }

        max = an1.length;
       
        //console.log(an1.length);
        // for(var j = 0; j < an1.length-1; j++){
        //     an1[j] = an1[j].trim();
        //     an2 += `[${j+1}] `;
        //     an2 += an1[j];
        //     an2 += '  ';
        // }
        agent.add(`${mot}`);
        // eslint-disable-next-line promise/always-return
        if(max > 0 && max <= 10){
            for(var j = 0; j < max-1; j++){                 
                an1[j] = an1[j].trim();
                an2 += `[${j+1}] `;
                an2 += an1[j];
                an2 += '\n';
            }
            agent.add(`Il y a ${max-1} antonymes`);
            agent.add(`${an2}`);
        }else if(max > 10){
            for(j = 0; j < 10; j++){
                //ran = randomInt(0,max);
                an1[j] = an1[j].trim();
                an2 += `[${j+1}] `;
                an2 += an1[j];
                an2 += '\n';
            }
           
            agent.add(`Il y a ${max-1} antonymes.`);
            agent.add(`Mais, je vais vous donner 10 seulement.`);
            agent.add(`${an2}`);
        }
        else {
            agent.add("Aucun résultat exact n'a été trouvé");
        }
        agent.add(variables.quickRepliesDefinition);
       //console.log(an2);
    });
}
module.exports = defineAntonyms;