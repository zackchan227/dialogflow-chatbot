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
    
    var ID = randomInt(0,7); // Global random seed for question's ID

    function saveID(id)
    {
        return id;
    }

    
    //Quick Reply
    const quickReplies = new Suggestion({
        title: "Que voulez-vous faire après?",
        reply: "Suivant"
    })
    quickReplies.addReply_("Annuler");

    //Quick Reply 2
    const quickReplies2 = new Suggestion({
        title: "Que-voulez vous faire?",
        reply: "Random Question"
    })
    quickReplies2.addReply_("Talk for 4");

    //Quick Reply 3
    const quickReplies3 = new Suggestion({
        title: "Choisissez une réponse",
        reply: "Quick Reply"
    })
    quickReplies3.addReply_("Suggestion");

    //Quick Reply 4
    const quickReplies4 = new Suggestion({
        title: "Que voulez-vous faire après?",
        reply: "Rejouer"
    })
    quickReplies4.addReply_("Annuler");

    // Generate Random questions 
    function askRandom(agent)
    {   
        return ref.once(`value`).then((snapshot)=>{


            var sumQ = 0;
            for(var i = 0; i < 7; i++) {
                if(snapshot.child(`AskRandomQ/${user_id}/${i}`).val() === "True")
                    sumQ++; 
            }
            
            if(sumQ === 6)
                for(var j = 0; j < 7; j++) {
                    admin.database().ref('data/AskRandomQ').child(`${user_id}/${j}`).set('False');
                }
                
            var checkQ = snapshot.child(`AskRandomQ/${user_id}/${ID}`).val();
            while(checkQ === "True"){
                ID = randomInt(0,7);
                checkQ = snapshot.child(`AskRandomQ/${user_id}/${ID}`).val();
                admin.database().ref('data/AskRandomQ').child(`${user_id}/${ID}`).set('False');
            }

            admin.database().ref('data/CurrentQuestion').child(`${user_id}`).set(ID);
            var question = snapshot.child(`questions/${ID}`).val();
            var answer0 = snapshot.child(`answers/${ID}/0`).val();
            var answer1 = snapshot.child(`answers/${ID}/1`).val();
            var answer2 = snapshot.child(`answers/${ID}/2`).val();
            var answer3 = snapshot.child(`answers/${ID}/3`).val();
            // eslint-disable-next-line promise/always-return
            if(question !== null)
            {
                agent.add(`[${ID+1}] - ${question}`);

                const quickReplies1 = new Suggestion({
                    title: "Choisissez une réponse",
                    reply: `${answer0}`
                })
                quickReplies1.addReply_(`${answer1}`);
                quickReplies1.addReply_(`${answer2}`);
                quickReplies1.addReply_(`${answer3}`);
    
                agent.add(quickReplies1);

                admin.database().ref('data/AskRandomQ').child(`${user_id}/${ID}`).set('True');
            }
        });
    }

    // Checking the correct answer of user in 4 answers
    function checkAnswer(agent)
    {
        return ref.once(`value`).then((snapshot)=>{
            var ans = agent.parameters['answer'];
            var currentQuestion = snapshot.child(`CurrentQuestion/${user_id}`).val();
            var correctA = snapshot.child(`corrects/${currentQuestion}`).val();
            var explication = snapshot.child(`notes/${currentQuestion}`).val();
            var check = false;

            if(ans === correctA) {
                check = true;
            }

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
                agent.add(`La bonne réponse est: "${correctA}"`);    
                agent.add(`Explication: ${explication}`);                                                                                         
            }       
            else {
                agent.add(`Pardon, il y a une erreur, réessayez!`);
                
            }

            agent.add(quickReplies4);
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
            agent.add(quickReplies);
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
                agent.add(quickReplies2);
                return;
        }
     
        const [translation] = await translate.translate(text, iso);
        agent.add(`${text} en ${lang}: ${translation}`);
        agent.add(quickReplies2);
      }

    
    // Obtenir l'identifiant utilisateur facebook
    var user_id = agent.originalRequest.payload.data.sender.id;

    // Default welcome when start to the conversation
    function welcome(agent) {

        // Appel au graphique Facebook pour obtenir les informations des utilisateurs
        var url = `https://graph.facebook.com/${user_id}?fields=name&access_token=EAADLSmoiLyMBALPNcqIorb0fCE6IpOb6xoxJawelRLZCmZCeuVnAg859nXhimFZCSAK21OT2PclZBT4t7paZANzWH4RDqVsySmASyFrZABmlJOZCYAZBZBaCwVvrxXwmf5PI7GZAvkDGjxOZC0rN2zCZCCzyQ9Dxs6RndIG8RuJNW3ZCG5gZDZD`;
        
        var options = {
          uri: url,
          json: true
        };

        return rp.get( options )
        // eslint-disable-next-line promise/always-return
        .then( body => {
            //console.log(body);
            agent.add(`Bonjour ${body.name}!!`);
            agent.add(quickReplies2);
            return admin.database().ref(`userID`).once(`value`).then((snapshot)=>{
                var valeur;
                var position;
                var deja = false;
                for(var i = 0; i< 1000; i++) {
                    valeur = snapshot.child(`${i}`).val();
                    // eslint-disable-next-line promise/always-return
                    if(valeur === null) {
                          position = i;
                          break;
                    }
                }
                for(var j = 0; j < position; j++) {
                    valeur = snapshot.child(`${j}`).val();
                    if(valeur === user_id) {
                        deja = true;
                        break;
                    }
                }
                if(deja === false)    
                    admin.database().ref('userID').child(`${position}`).set(user_id);         
            });
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
        agent.add(quickReplies3);
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

