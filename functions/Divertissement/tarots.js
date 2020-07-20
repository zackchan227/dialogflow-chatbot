const variables = require('../variables');
const index = require('../index');
const cheerio = require('cheerio');
const rp = require('request-promise-native');

function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
}

function tarots(agent){
    //var sign = agent.parameters['horoscope'];
    var check = false;
    var index = randomInt(0,22) + 1;
    if(index > 0 && index < 23)
    {
        check = true;
    }
    // var horos = ['Bélier', 'Taureau', 'Gémeaux','Cancer','Lion', 'Viegre', 'Balance', 'Scorpion','Sagittaire', 'Capricorne','Verseau','Poissons'];
    // var check = false;
    // var index;
    // for(var i = 0; i < 12; i++){
    //     if(sign === horos[i]){
    //         check = true;
    //         index = i+1;
    //         break;
    //     }
    // }

    if(check !== true){
        agent.add(`Il y a une erreur!`);
        //agent.add(quickRepliesTest);
        return;
    }

    if(check === true){
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
            var text = $('div.span-9.span-xs-12.col').text();
            var text1 = '';
            // eslint-disable-next-line promise/always-return
            for(var i = 0; i < 1696; i++){
                
                if(i > 200 && text[i] === '\n'){
                    break;
                }
                text1 += text[i];
            }
            agent.add(`${text1}`);
            agent.add(variables.quickReplies2F);
        })
    }
}
module.exports = tarots;