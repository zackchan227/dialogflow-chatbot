/* eslint-disable promise/catch-or-return */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable promise/always-return */
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
//const axios = require('axios');
//const request = require('request-promise');
//const FB = require('fb');
const Facebook = require('facebook-node-sdk');
const request = require('request');
const cheerio = require('cheerio');
const rp = require('request-promise-native');
const align = require('align-text');
const esrever = require('esrever');
//const {google} = require('googleapis');
const projectId = 'mr-fap-naainy';
const {Translate} = require('@google-cloud/translate').v2;
//const welcomeFunction = require('./welcome');
//const projectID = JSON.parse(process.env.FIREBASE_CONFIG).projectId;
const welcome = require('./welcome');

// TCF plug-ins
const TCFStation = require('./TCF/TCFStation');
const regarderNiveau = require('./TCF/regarderNiveau');
const questionsRandom = require('./TCF/questionsRandom');
const questionsCheck = require('./TCF/questionsCheck');

// Outils plug-ins
const outilsStation = require('./Outils/outilsStation');
const idiomes = require('./Outils/idiomes');
const eCommunes = require('./Outils/eCommunes');
const definitionStation = require('./Outils/definitionStation');
const definition = require('./Outils/definition')
const synonymes = require('./Outils/synonymes');
const antonymes = require('./Outils/antonymes');
const traduction = require('./Outils/traduction');

//

// Contact plug-ins
const contactezNousStation = require('./Contact/contactezNousStation');
const contactNous = require('./Contact/contactNous');
const questionStation = require('./Contact/questionStation');
const regarderResponses = require('./Contact/regarderResponses');

// Admin plug-ins
const adminStation = require('./Admin/adminStation');
const adminQuestionStation = require('./Admin/adminQuestionStation');
const questionReponse = require('./Admin/questionReponse');

const translate = new Translate({projectId});


const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
// const serviceAccount = require("./mr-fap-naainy-firebase-adminsdk-d55vb-67d7b85f0b.json");
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: `https://mr-fap-naainy.firebaseio.com/`
// });

const ref = admin.database().ref(`data`);
var facebook = new Facebook({ appID: '223520468643619', secret: 'nothing' });

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.chatBot = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    function randomInt(min, max) {
        return min + Math.floor((max - min) * Math.random());
    }
    
    //Quick Reply
    const quickRepliesF = new Suggestion({
        title: "Que voulez-vous faire après?",
        reply: "Suivant"
    })
    quickRepliesF.addReply_("Annuler");

    const quickRepliesE = new Suggestion({
        title: "What do you want to do next?",
        reply: "Next"
    })
    quickRepliesE.addReply_("Cancel");

    const quickRepliesV = new Suggestion({
        title: "Muốn xem tiếp chứ?",
        reply: "Triển luôn bạn ei"
    })
    quickRepliesV.addReply_("Đéo");

    const quickRepliesDivertissement = new Suggestion({
        title: "Vous pouvez vous référer aux horoscopes, aux horoscopes chinois et au tarot pour prédire votre destin aujourd'hui.",
        reply: "Horoscopes"
    })
    quickRepliesDivertissement.addReply_("Horoscopes Chinois");
    quickRepliesDivertissement.addReply_("Tarot");

    //Quick Reply 3
    const quickReplies3F = new Suggestion({
        title: "Choisissez une réponse",
        reply: "Quick Reply"
    })
    quickReplies3F.addReply_("Suggestion");

    //Quick Reply 4
    const quickReplies4 = new Suggestion({
        title: "Que voulez-vous faire après?",
        reply: "Rejouer"
    })
    quickReplies4.addReply_("Annuler");

    /////////////////////////////////////////////////////////
    const quickReplies2F = new Suggestion({
        title: "Que-voulez vous faire?",
        reply: "TCF Question"
    })
    quickReplies2F.addReply_("Outils");
    quickReplies2F.addReply_("Divertissement");
    quickReplies2F.addReply_("Contacte l'admin");

    // Quick Reply Horoscopes
    const quickRepliesHoroscopes = new Suggestion({
        title: "Choisissez votre signe",
        reply: "Bélier"
    })
    quickRepliesHoroscopes.addReply_("Taureau");
    quickRepliesHoroscopes.addReply_("Gémeaux");
    quickRepliesHoroscopes.addReply_("Cancer");
    quickRepliesHoroscopes.addReply_("Lion");
    quickRepliesHoroscopes.addReply_("Viergie");
    quickRepliesHoroscopes.addReply_("Balance");
    quickRepliesHoroscopes.addReply_("Scorpion");
    quickRepliesHoroscopes.addReply_("Sagittaire");
    quickRepliesHoroscopes.addReply_("Capricorne");
    quickRepliesHoroscopes.addReply_("Verseau");
    quickRepliesHoroscopes.addReply_("Poissons");

    // Quick Reply Horoscopes China
    const quickRepliesHoroscopesChinois = new Suggestion({
        title: "Choisissez votre signe ou donne moi votre année de naissance",
        reply: "🐭"
    })
    quickRepliesHoroscopesChinois.addReply_("🐮");
    quickRepliesHoroscopesChinois.addReply_("🐯");
    quickRepliesHoroscopesChinois.addReply_("🐰");
    quickRepliesHoroscopesChinois.addReply_("🐉");
    quickRepliesHoroscopesChinois.addReply_("🐍");
    quickRepliesHoroscopesChinois.addReply_("🐴");
    quickRepliesHoroscopesChinois.addReply_("🐐");
    quickRepliesHoroscopesChinois.addReply_("🐵");
    quickRepliesHoroscopesChinois.addReply_("🐤");
    quickRepliesHoroscopesChinois.addReply_("🐶");
    quickRepliesHoroscopesChinois.addReply_("🐷");

    // Checking the incorrect answer of user in 4 answers
    function checkFallback(agent) {
        return ref.once(`value`).then((snapshot)=>{
            var ran = randomInt(0,4);
            var a0 = snapshot.child(`answers/${id}/0`).val();
            var a1 = snapshot.child(`answers/${id}/1`).val();
            var a2 = snapshot.child(`answers/${id}/2`).val();
            var a3 = snapshot.child(`answers/${id}/3`).val();
            var text1 = `Quelle est votre bonne réponse ?`;
            var text2 = `Votre réponse est ?`;
            var text3 = `Choisissez une réponse ci-dessous`;
            var text4 = `Choisissez la bonne réponse, s'il vous plaît`;
            // eslint-disable-next-line promise/always-return
            switch(ran)
            {
                case 0: agent.add(text1);
                        break;
                case 1: agent.add(text2);
                        break;
                case 2: agent.add(text3);
                        break;
                case 3: agent.add(text4);
                        break; 
            }
            const quickReplies5 = new Suggestion({
                title: "Choisissez une réponse",
                reply: `${a0}`
            })
            quickReplies5.addReply_(`${a1}`);
            quickReplies5.addReply_(`${a2}`);
            quickReplies5.addReply_(`${a3}`);

            agent.add(quickReplies5);
        });
    }

    // Obtenir l'identifiant utilisateur facebook
    // Cette variable doit être globale
    var user_id = agent.originalRequest.payload.data.sender.id;
    exports.user_id = user_id;

    // Default fallback when the chatbot did not understand
    function fallback(agent) {
        agent.add(`Je n'ai pas compris`);
        agent.add(`Je suis désolé, pouvez-vous réessayer?`);
        // agent.add(`I didn't understand`);
        // agent.add(`I'm sorry, can you try again?`);
    }
    var datetime = new Date();
    var hh = datetime.getHours();
    var dd = datetime.getDate();
    var mm = datetime.getMonth()+1;
    function divertissementStation(agent) {     
        var mois;
        switch(mm){
            case 1:
                mois = "Janvier";
                break;
            case 2:
                mois = "Février";
                break;
            case 3:
                mois = "Mars";
                break;
            case 4:
                mois = "Avril";
                break;
            case 5:
                mois = "Mai";
                break;
            case 6:
                mois = "Juin";
                break;
            case 7:
                mois = "Juillet";
                break;
            case 8:
                mois = "Août";
                break;
            case 9:
                mois = "Septembre";
                break;
            case 10:
                mois = "Octobre";
                break;
            case 11:
                mois = "Novembre";
                break;
            case 12:
                mois = "Décembre";
                break;
        }

        var yyyy = datetime.getFullYear();

        agent.add(`Aujourd'hui c'est: ${dd} ${mois} ${yyyy}`);
        agent.add(quickRepliesDivertissement);
    }

    function checkDay(){
        var day;
        return  day = (hh >= 0 && hh <= 14) ? 'demain' :  'aujourdhui';
    }

    function contentHoroscopes(agent){
        agent.add(quickRepliesHoroscopes);
    }
    // eslint-disable-next-line consistent-return
    // 
    function horoscopes(agent){
        var sign = agent.parameters['horoscope'];
        var horos = ['Bélier', 'Taureau', 'Gémeaux','Cancer','Lion', 'Viegre', 'Balance', 'Scorpion','Sagittaire', 'Capricorne','Verseau','Poissons'];
        var check = false;
        var index;
        var day = checkDay();

        for(var i = 0; i < 12; i++){
            if(sign === horos[i]){
                check = true;
                index = i+1;
                break;
            }
        }

        if(check !== true){
            agent.add(`Horoscope ${sign} n'est pas disponible`);
            agent.add(quickRepliesTest);
            return;
        }

        if(check === true){
            const URL = `https://www.horoscope.com/fr/horoscopes/general/horoscope-general-du-jour-${day}.aspx?signe=${index}`; // Crawl data from URL
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
                var text = $('div.horoscope-content > p').text();
                var text1 = '';
                for(var i = 0; i < 1696; i++){
                    
                    if(i > 200 && text[i] === '\n'){
                        break;
                    }
                    text1 += text[i];
                }
                agent.add(`Horoscopes ${sign}: `);
                agent.add(text1);
                agent.add(quickReplies2F);
            })
        }
    }

    function contentHoroscopesChinois(agent){
        agent.add(quickRepliesHoroscopesChinois);
    }
    // eslint-disable-next-line consistent-return
    // 
    function horoscopesChinois(agent){
        var sign = agent.parameters['HoroscopesChina'];
        var horos = ['🐭', '🐮', '🐯','🐰','🐉', '🐍', '🐴', '🐐','🐵', '🐤','🐶','🐷'];
        var check = false;
        var index;
        var day = checkDay();

        if(isNaN(sign)){
            for(var i = 0; i < 12; i++){
                if(sign === horos[i]){
                    check = true;
                    switch(sign){
                        case '🐵': 
                            index = 9;
                            sign = 'Singe';
                            break;
                        case '🐤':
                            index = 10;
                            sign = 'Coq';
                            break;
                        case '🐶':
                            index = 11;
                            sign ='Chien';
                            break;
                         case '🐷':
                            index = 12;
                            sign ='Cochon';
                            break;
                         case '🐭':
                            index = 3;
                            sign ='Rat';
                            break;
                         case '🐮':
                            index = 1;
                            sign ='Boeuf';
                            break;
                         case '🐯':
                            index = 6;
                            sign ='Tigre';
                            break;
                         case '🐰':
                            index = 7;
                            sign ='Lièvre';
                            break;
                         case '🐉':
                            index = 5;
                            sign ='Dragon';
                            break;
                         case '🐍':
                            index = 4;
                            sign ='Serpent';
                            break;
                         case '🐴':
                            index = 8;
                            sign ='Cheval';
                            break;
                         case '🐐':
                            index = 2;
                            sign ='Chèvre';
                            break;
                    }
                    //index = i+1;
                    break;
                }
            }
        }
        else {
            check = true;
            var mod = sign % 12;
            switch(mod){
                case 0: 
                    index = 9;
                    sign = 'Singe';
                    break;
                case 1:
                    index = 10;
                    sign = 'Coq';
                    break;
                case 2:
                    index = 11;
                    sign ='Chien';
                    break;
                 case 3:
                    index = 12;
                    sign ='Cochon';
                    break;
                 case 4:
                    index = 3;
                    sign ='Rat';
                    break;
                 case 5:
                    index = 1;
                    sign ='Boeuf';
                    break;
                 case 6:
                    index = 6;
                    sign ='Tigre';
                    break;
                 case 7:
                    index = 7;
                    sign ='Lièvre';
                    break;
                 case 8:
                    index = 5;
                    sign ='Dragon';
                    break;
                 case 9:
                    index = 4;
                    sign ='Serpent';
                    break;
                 case 10:
                    index = 8;
                    sign ='Cheval';
                    break;
                 case 11:
                    index = 2;
                    sign ='Chèvre';
                    break;
            }
        }

        if(check !== true){
            agent.add(`Horoscope ${sign} n'est pas disponible`);
            agent.add(quickRepliesTest);
            return;
        }

        if(check === true){
            const URL = `https://www.horoscope.com/fr/horoscopes/chinois/horoscope-chinois-du-jour-${day}.aspx?signe=${index}`; // Crawl data from URL
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
                var text = $('div.horoscope-content > p').text();
                var text1 = '';
                for(var i = 0; i < 1696; i++){
                    
                    if(i > 200 && text[i] === '\n'){
                        break;
                    }
                    text1 += text[i];
                }
                agent.add(`Horoscopes ${sign}: `);
                agent.add(text1);
                agent.add(quickReplies2F);
            })
        }
    }

    function contentTarots(agent){
        //agent.add(quickRepliesHoroscopes);
    }
    // eslint-disable-next-line consistent-return
    // 
    // eslint-disable-next-line consistent-return
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
                for(var i = 0; i < 1696; i++){
                    
                    if(i > 200 && text[i] === '\n'){
                        break;
                    }
                    text1 += text[i];
                }
                agent.add(`${text1}`);
                //agent.add(quickReplies2F);
            })
        }
    }

    // // Uncomment and edit to make your own intent handler
    // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    // Just testing
    function test(agent) {
        agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
        agent.add(new Card({
            title: `Title: this is a card title`,
            imageUrl: 'https://drive.google.com/file/d/1OKRA4s4HhgfZqVG8C1Q7VPB3Z3_FClHm/view',
            text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
            buttonText: 'This is a button',
            buttonUrl: 'https://assistant.google.com/'
        })
        );
        agent.add(quickReplies3F);
        //agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
    }

    // // Uncomment and edit to make your own Google Assistant intent handler
    // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    // function googleAssistantHandler(agent) {
    //   let conv = agent.conv(); // Get Actions on Google library conv instance
    //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
    //   agent.add(conv); // Add Actions on Google library responses to your agent's response
    // }
    // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
    // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

    // Run the proper function handler based on the matched Dialogflow intent name
    
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    // intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('Test', test);

    intentMap.set('TCFNotification', TCFStation);
    intentMap.set('Random', questionsRandom);
    intentMap.set('Answers', questionsCheck);
    intentMap.set('Resultat', regarderNiveau);

    intentMap.set('AnswersFallback', checkFallback);

    intentMap.set('outilsStation', outilsStation);
    intentMap.set('Idioms', idiomes);
    intentMap.set('Expressions', eCommunes);
    intentMap.set('Translate', traduction);
    intentMap.set('Definition', definitionStation);
    intentMap.set('Words', definition);
    intentMap.set('Words - custom', definition);
    intentMap.set('Synonyms', synonymes);
    intentMap.set('Synonyms - custom', synonymes);
    intentMap.set('Antonyms', antonymes);
    intentMap.set('Antonyms - custom', antonymes);

    intentMap.set('divertissementStation', divertissementStation);
    intentMap.set('Horoscopes', contentHoroscopes);
    intentMap.set('Horoscopes - custom', horoscopes);
    intentMap.set('Horoscopes China', contentHoroscopesChinois);
    intentMap.set('Horoscopes China - custom', horoscopesChinois);
    intentMap.set('Tarots', tarots);
    //intentMap.set('Tarot - custom', tarots);
   
    intentMap.set('contactezNousStation', contactezNousStation);
    intentMap.set('contactNous', contactNous);
    intentMap.set('utilisateurquestionStation', questionStation);
    intentMap.set('regarderResponses', regarderResponses);

    intentMap.set('Admin', adminStation);
    intentMap.set('adminQuestionStation', adminQuestionStation);
    intentMap.set('questionReponse', questionReponse);
    
    agent.handleRequest(intentMap);
});

