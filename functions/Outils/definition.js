const variables = require('../variables');

// Define the word
function defineWords(agent){
    var word = agent.parameters['word'];
    //var ran = Math.floor((10) * Math.random());
    // var options = {
    //     method: 'GET',
    //     url: 'https://mashape-community-urban-dictionary.p.rapidapi.com/define',
    //     qs: {term: `${word}`},
    //     headers: {
    //     'x-rapidapi-host': 'mashape-community-urban-dictionary.p.rapidapi.com',
    //     'x-rapidapi-key': '150ec41dbcmsh0524350c3406a72p1fc807jsnbd8c05b29ec9'
    //     }
    // };
    
    // // eslint-disable-next-line prefer-arrow-callback
    // return rp(options, function (error, response, body) {
    //     const def = JSON.parse(body);
    //     //console.log(def.list[ran].definition);
    //     agent.add(`${def.list[ran].definition}`);
    // });
    const URL = `https://www.le-dictionnaire.com/definition/${word}`; // Crawl data from URL
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
        //console.log($('div.view-content > ul').text())
        //console.log(`Définition ${word}: `);
        var text;
        var i = 2,j = 1, k = 0;
        var flag = true;
        var mot = $('div.defbox > span').text();
        var text1 = [];
        var text2 = '';
        while(flag){
            text = $(`div.defbox > ul:nth-child(${i}) > li:nth-child(${j})`).text();
            //console.log(`${text}`);
            //console.log(text);
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
        //console.log(text1.length-1);
        // eslint-disable-next-line promise/always-return
        for(j = 0; j < text1.length-1; j++){
           
            text1[j] = text1[j].trim();
            //console.log(text1);
            text2 += `[${j+1}] `;
            text2 += text1[j];
            text2 += '\n';
        }

        //console.log(`${text2}`);
        agent.add(`Définition de ${word}:`);
        agent.add(`Il y a ${text1.length-1} significations`)
        agent.add(`${text2}`);
        agent.add(variables.quickRepliesDefinition);
        // eslint-disable-next-line prefer-arrow-callback
    })
}
module.exports = defineWords;