/* eslint-disable promise/catch-or-return */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable promise/always-return */
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

// API externes
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Facebook = require('facebook-node-sdk');
const cheerio = require('cheerio');
const rp = require('request-promise-native');
const projectId = 'mr-fap-naainy';
const {Translate} = require('@google-cloud/translate').v2;
const welcome = require('./welcome');

// TCF plug-ins
const TCFStation = require('./TCF/TCFStation');
const regarderNiveau = require('./TCF/regarderNiveau');
const questionsRandom = require('./TCF/questionsRandom');
const questionsCheck = require('./TCF/questionsCheck');
const comprehensionOrale = require('./TCF/comprehensionOrale');
const comprehensionOraleCheck = require('./TCF/comprehensionOraleCheck');

// Outils plug-ins
const outilsStation = require('./Outils/outilsStation');
const idiomes = require('./Outils/idiomes');
const eCommunes = require('./Outils/eCommunes');
const definitionStation = require('./Outils/definitionStation');
const definition = require('./Outils/definition')
const synonymes = require('./Outils/synonymes');
const antonymes = require('./Outils/antonymes');
const traduction = require('./Outils/traduction');

//divertissementStation
const divertissementStation = require('./Divertissement/divertissementStation');
const horoscopes = require('./Divertissement/horoscopes');
const horoscopesChinois = require('./Divertissement/horoscopes_chinois');
const tarots = require('./Divertissement/tarots');

// Contact plug-ins
const contactezNousStation = require('./Contact/contactezNousStation');
const contactNous = require('./Contact/contactNous');
const questionStation = require('./Contact/questionStation');
const regarderReponses = require('./Contact/regarderReponses');

// Admin plug-ins
const adminStation = require('./Admin/adminStation');
const adminQuestionStation = require('./Admin/adminQuestionStation');
const questionReponse = require('./Admin/questionReponse');
const adminPoserQStation = require('./Admin/adminPoserQStation');
const niveauQuestion = require('./Admin/niveauQuestion');
const contexteQuestion = require('./Admin/contexteQuestion');
const R1 = require('./Admin/R1');
const R2 = require('./Admin/R2');
const R3 = require('./Admin/R3');
const R4 = require('./Admin/R4');
const reponseCorrect = require('./Admin/reponseCorrect');
const explicationQuestion = require('./Admin/explicationQuestion');
const adminQuestionStation_cancel = require('./Admin/adminQuestionStation_cancel');

const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
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
    exports.randomInt = randomInt;
    
    // //Quick Reply 3
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

    // Quick Reply Horoscopes
    const quickRepliesHoroscopes = new Suggestion({
        title: "Choisissez votre signe",
        reply: "Bélier"
    })
    quickRepliesHoroscopes.addReply_("Taureau");
    quickRepliesHoroscopes.addReply_("Gémeaux");
    quickRepliesHoroscopes.addReply_("Cancer");
    quickRepliesHoroscopes.addReply_("Lion");
    quickRepliesHoroscopes.addReply_("Viegre");
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
    // function checkFallback(agent) {
    //     return ref.once(`value`).then((snapshot)=>{
    //         var ran = randomInt(0,4);
    //         var a0 = snapshot.child(`answers/${id}/0`).val();
    //         var a1 = snapshot.child(`answers/${id}/1`).val();
    //         var a2 = snapshot.child(`answers/${id}/2`).val();
    //         var a3 = snapshot.child(`answers/${id}/3`).val();
    //         var text1 = `Quelle est votre bonne réponse ?`;
    //         var text2 = `Votre réponse est ?`;
    //         var text3 = `Choisissez une réponse ci-dessous`;
    //         var text4 = `Choisissez la bonne réponse, s'il vous plaît`;
    //         eslint-disable-next-line promise/always-return
    //         switch(ran)
    //         {
    //             case 0: agent.add(text1);
    //                     break;
    //             case 1: agent.add(text2);
    //                     break;
    //             case 2: agent.add(text3);
    //                     break;
    //             case 3: agent.add(text4);
    //                     break; 
    //         }
    //         const quickReplies5 = new Suggestion({
    //             title: "Choisissez une réponse",
    //             reply: `${a0}`
    //         })
    //         quickReplies5.addReply_(`${a1}`);
    //         quickReplies5.addReply_(`${a2}`);
    //         quickReplies5.addReply_(`${a3}`);

    //         agent.add(quickReplies5);
    //     });
    // }

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

    function contentHoroscopes(agent){
        agent.add(quickRepliesHoroscopes);
    }

    function contentHoroscopesChinois(agent){
        agent.add(quickRepliesHoroscopesChinois);
    }

    // function contentTarots(agent){
    //     agent.add(quickRepliesHoroscopes);
    // }
    // eslint-disable-next-line consistent-return
    // 
    // eslint-disable-next-line consistent-return

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
    intentMap.set('comprehensionOrale', comprehensionOrale);
    intentMap.set('comprehensionOraleCheck', comprehensionOraleCheck);
    
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
    intentMap.set('regarderReponses', regarderReponses);

    intentMap.set('Admin', adminStation);
    intentMap.set('adminQuestionStation', adminQuestionStation);
    intentMap.set('questionReponse', questionReponse);
    intentMap.set('adminPoserQStation', adminPoserQStation);
    intentMap.set('niveauQuestion', niveauQuestion);
    intentMap.set('contexteQuestion', contexteQuestion);
    intentMap.set('R1', R1);
    intentMap.set('R2', R2);
    intentMap.set('R3', R3);
    intentMap.set('R4', R4);
    intentMap.set('reponseCorrect', reponseCorrect);
    intentMap.set('explicationQuestion', explicationQuestion);
    intentMap.set('adminQuestionStation - cancel', adminQuestionStation_cancel);
    
    agent.handleRequest(intentMap);
});

