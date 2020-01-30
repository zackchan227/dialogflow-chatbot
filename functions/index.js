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
const rp = require('request-promise-native');
//const {google} = require('googleapis');
const projectId = 'mr-fap-naainy';
const {Translate} = require('@google-cloud/translate').v2;
//const projectID = JSON.parse(process.env.FIREBASE_CONFIG).projectId;

const translate = new Translate({projectId});


const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion, Payload} = require('dialogflow-fulfillment');
const serviceAccount = require("./mr-fap-naainy-firebase-adminsdk-d55vb-67d7b85f0b.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://mr-fap-naainy.firebaseio.com/`
});

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
    const ID = randomInt(0,7); // Global random seed for question's ID

   function saveID(id)
   {
       return id;
   }

    // Generate Random questions 
    function askRandom(agent)
    {      
        return ref.once(`value`).then((snapshot)=>{
            var question = snapshot.child(`questions/${ID}`).val();
            var answer0 = snapshot.child(`answers/${ID}/0`).val();
            var answer1 = snapshot.child(`answers/${ID}/1`).val();
            var answer2 = snapshot.child(`answers/${ID}/2`).val();
            var answer3 = snapshot.child(`answers/${ID}/3`).val();
            var note = snapshot.child(`notes/${ID}`).val();
            var correct = snapshot.child(`corrects/${ID}`).val();
            // eslint-disable-next-line promise/always-return
            if(question !== null)
            {
                // let payload = {
                //     "messages":{
                //       "attachment": {
                //         "type": "quick_replies",
                //         "payload": {
                //             elements: [
                //                 {
                //                   text: 'Choisissez une bonne réponse',
                //                   quick_replies: [
                //                     {
                //                       title: `${answer0}`
                //                     },
                //                     {
                //                       title: `${answer1}`
                //                     },
                //                     {
                //                       title: `${answer2}`
                //                     },
                //                     {
                //                       title: `${answer3}`
                //                     }
                //                   ]
                //                 }
                //               ]
                //            }
                //       }
                //     }
                //   }

                agent.add(`[${ID+1}] - ${question}`);
                // agent.requestSource = agent.facebook;
                //agent.add(new Payload('facebook', payload));
                agent.add(new Suggestion(`${answer0}`));
                agent.add(new Suggestion(`${answer1}`));
                agent.add(new Suggestion(`${answer2}`));
                agent.add(new Suggestion(`${answer3}`));
                //agent.add(`La bonne réponse est ${correct}`);
                //agent.add(`${note}`);
            }
        });
    }

    // Checking the correct answer of user in 4 answers
    function checkAnswer(agent)
    {
        return ref.once(`value`).then((snapshot)=>{
            var ans = agent.parameters['answer'];
            var correctAnswer;
            var correctNumber;
            var explication;
            var check = false;
            // eslint-disable-next-line promise/always-return
            for(var i = 0; i < 7; i++){
                var CorrectAnswer = snapshot.child(`corrects/${i}`).val();
                if(ans === CorrectAnswer) {                                                     
                    check = true;
                    break;
                }
            }
            // eslint-disable-next-line promise/always-return
            for(var j=0; j<7; j++){
                for(var k=0; k<4; k++){
                    CorrectAnswer = snapshot.child(`answers/${j}/${k}`).val();
                    if(ans === CorrectAnswer) {
                        correctNumber = j;      
                        break;         
                    }     
                }
            } 

            explication = snapshot.child(`notes/${correctNumber}`).val();
            if(ans === 'je ne sais pas'){
                agent.add(`Essayez d'y répondre, ne vous inquiétez pas de l'échec 🤗`);
            }
            else if(check === true){
                agent.add(`C'est Correct :D`);    
                agent.add(`${explication}`);
            }
            //eslint-disable-next-line promise/always-return
            else if(check !== true && explication !== null){ 
                agent.add(`Ce n'est pas correct :(`);              
                correctAnswer = snapshot.child(`corrects/${correctNumber}`).val();
                agent.add(`La bonne réponse est ${correctAnswer}`);
                // eslint-disable-next-line promise/always-return               
                agent.add(`${explication}`);                                                                                         
            }       
            else {
                agent.add(`Pardon, il y a une erreur, réessayez!`);
                
            }                 
            agent.add(new Suggestion(`Rejouer`));
            agent.add(new Suggestion(`Annuler`));    
        });       
    }

    // Checking the incorrect answer of user in 4 answers
    function checkFallback(agent) {
        
        return ref.once(`value`).then((snapshot)=>{
            var ran = randomInt(0,4);
            var id = saveID(ID);
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
            agent.add(new Suggestion(`${a0}`));
            agent.add(new Suggestion(`${a1}`));
            agent.add(new Suggestion(`${a2}`));
            agent.add(new Suggestion(`${a3}`));

    });
}

    // Function is made for 4
    function talk4For(agent)
    {
        var ran = randomInt(0,4);
        return ref.once(`value`).then((snapshot)=>{
            var idiom = snapshot.child(`idioms/${ran}`).val();
            // eslint-disable-next-line promise/always-return
            if(idiom !== null){
                agent.add(`${idiom}`);               
            }
            else {
                agent.add(`Je suis désolé, il y a une erreur!`);
            }
            agent.add(new Suggestion(`Suivant`));
            agent.add(new Suggestion(`Annuler`));
        });
    }

    // Translate function from any languages to another (Available in 4 languages)
    async function translateText(agent) {       
        var text = agent.parameters['any']; // The text to translate
        var lang = agent.parameters['language']; // The target language
        var iso; // The target language's iso code
       
        switch(lang)
        {
            case 'Anglais':
            case 'English':
            case 'tiếng anh':
            case 'tiếng end':
            case 'endrjsk':
            case 'engrisk':
            case 'Tiếng Anh':
            case '英语':
            case '英文':
                iso = 'en';
                break;
            case 'Française':
            case 'Français':
            case 'Francaise':
            case 'Francais':
            case 'French':
            case 'tiếng pháp':
            case 'Tiếng Pháp':
            case 'Tiếng FAP':
            case 'tiếng fap':
            case 'fap':
            case '法语':
            case '法文':
                iso = 'fr';
                break;
            case 'Vietnamien':
            case 'Vietnamese':
            case 'Tiếng Việt':
            case 'tiếng việt':
            case 'tiếng vịt':
            case 'tiếng Vịt':
            case 'Tiếng Vịt':
            case 'vịt':
            case '越南语':
            case '越南文':
                iso = 'vi';
                break;
            case 'Chinois':
            case 'Chinese':
            case 'Tiếng Trung':
            case 'Tiếng Tàu':
            case 'Tiếng Hoa':
            case 'tiếng trung quốc':
            case 'trung quốc':
            case 'trung':
            case 'tiếng tàu':
            case '中文':
            case '华语':
                iso = 'zh';
                break;
            default:
                iso = 'null';
                agent.add(`Pardon, la langue ${lang} n'est pas encore supporté.`);
                agent.add(new Suggestion(`Random Question`));
                agent.add(new Suggestion(`Talk 4 For`));
                return;
        }
     
        const [translation] = await translate.translate(text, iso);
        agent.add(`${text} en ${lang}: ${translation}`);
        agent.add(new Suggestion(`Random Question`));
        agent.add(new Suggestion(`Talk 4 For`));
      }

    // Default welcome when start to the conversation
    function welcome(agent) {
        var user_id = agent.originalRequest.payload.data.sender.id;
        var url = `https://graph.facebook.com/${user_id}?fields=name&access_token=EAADLSmoiLyMBALPNcqIorb0fCE6IpOb6xoxJawelRLZCmZCeuVnAg859nXhimFZCSAK21OT2PclZBT4t7paZANzWH4RDqVsySmASyFrZABmlJOZCYAZBZBaCwVvrxXwmf5PI7GZAvkDGjxOZC0rN2zCZCCzyQ9Dxs6RndIG8RuJNW3ZCG5gZDZD`;
        var options = {
          uri: url,
          json: true
        };

        return rp.get( options )
        // eslint-disable-next-line promise/always-return
        .then( body => {
            //console.log(body);
            agent.add(`Bonjour ${body.name}, que-voulez vous faire ?`);
            agent.add(new Suggestion(`Random Question`));
            agent.add(new Suggestion(`Talk 4 For`));
        });
    }
    // Default fallback when the chatbot did not understand
    function fallback(agent) {
        agent.add(`Je n'ai pas compris`);
        agent.add(`Je suis désolé, pouvez-vous réessayer?`);
        // agent.add(`I didn't understand`);
        // agent.add(`I'm sorry, can you try again?`);
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
        agent.add(new Suggestion(`Quick Reply`));
        agent.add(new Suggestion(`Suggestion`));
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
    intentMap.set('Random', askRandom);
    intentMap.set('Answers', checkAnswer);
    intentMap.set('AnswersFallback', checkFallback);
    intentMap.set('Idioms', talk4For);
    intentMap.set('Translate', translateText);
    agent.handleRequest(intentMap);
});

