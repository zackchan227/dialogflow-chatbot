const variables = require('../variables');

// Define the synonyms of word
function defineSynonyms(agent){
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
        var i = 2;
        var mot = `Synonymes de ${word}`;
        var sym; 
        var sym1 = [];
        var sym2 = '';
        var max,ran;
        //console.log(mot);
        while(flag){
            sym = $(`#synonymes > a:nth-child(${i})`).text();
            sym1[i-2] = sym;                
            if(sym){
                i++;    
            }else flag = false;
        }

        max = sym1.length;                   
        //console.log(sym1.length);
        // for(var j = 0; j < sym1.length-1; j++){    
        //     sym1[j] = sym1[j].trim();
        //     sym2 += `[${j+1}] `;
        //     sym2 += sym1[j];
        //     sym2 += '  ';
        // }
        agent.add(`${mot}`);
        // eslint-disable-next-line promise/always-return
        if(max > 0 && max <= 10){
            for(var j = 0; j < max-1; j++){
                sym1[j] = sym1[j].trim();
                sym2 += `[${j+1}] `;
                sym2 += sym1[j];
                sym2 += '\n';
            }
            agent.add(`Il y a ${max-1} synonymes`);
            agent.add(`${sym2}`);
        }else if(max > 10){
            //var old = -1;
            for(j = 0; j < 10; j++){
                //ran = randomInt(0,max);
                // while(old === ran){
                //     ran = randomInt(0,max);
                // }
                sym1[j] = sym1[j].trim();
                sym2 += `[${j+1}] `;
                sym2 += sym1[j];
                sym2 += '\n';
                //old = ran;
            }
            agent.add(`Il y a ${max-1} synonymes`);
            agent.add(`Mais, je vais vous donner 10 seulement.`);
            agent.add(`${sym2}`);
        }
        else {
            agent.add("Aucun résultat exact n'a été trouvé");
        }          
        agent.add(variables.quickRepliesDefinition);
    });
}
module.exports = defineSynonyms;