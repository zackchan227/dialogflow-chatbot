/* eslint-disable handle-callback-err */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable promise/catch-or-return */
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';


const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
//const request = require('request-promise');
const FB = require('fb');
const Facebook = require('facebook-node-sdk');
const {google} = require('googleapis');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion, Payload} = require('dialogflow-fulfillment');
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `ws://mr-fap-naainy.firebaseio.com/`
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

// Asking a random question from database 
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
    // const context = agent.context.get('answers-followup');
    // const any = context.parameters ? context.parameters.answer : undefined;

    // if(!context || !any)
    // {
    //     agent.add(`Je suis désolé, J'ai oublié votre réponse!`);
    //     agent.add(`Voulez-vous rejouer?`);
    //     agent.add(new Suggestion(`Rejouer`));
    //     agent.add(new Suggestion(`Annuler`));
    // }
    //var context = agent.getContext('answers-followup');
    const context = agent.context.get('answers-followup');
    // eslint-disable-next-line no-throw-literal
    if(!context) throw "Answer context is not defined in PreferrenceAdd";
    var userAnswer = context.parameters['answer'];
    console.log(usersAnswer);
    agent.add(`Votre réponse est ${userAnswer}`);
    // return ref.once(`value`).then((snapshot)=>{
    //     var note = snapshot.child(`notes/${ID}`).val();
    //     var correct = snapshot.child(`corrects/${ID}`).val();
      
    //     //var userAnswer = agent.parameters['answer'];
        
    //     // eslint-disable-next-line promise/always-return
    //     if(userAnswer !== null && correct === userAnswer)
    //     {
            
    //         agent.add(`C'est vrai, ${note}`);
    //         agent.context.delete('answers-followup');
    //         //agent.add(`La bonne réponse est ${correct}`);
    //         //agent.add(`${note}`);
    //     }
    //     else {
    //         agent.add(`C'est incorrect, la bonne réponse est ${correct}, ${note}`); 
    //     }
    //     // else if(userAnswer !== correct)
    //     // {
    //     //     if(userAnswer === answer0 || userAnswer === answer1 || userAnswer === answer2 || userAnswer === answer3)
    //     //     {
    //     //         agent.add(`C'est incorrect, la bonne réponse est ${correct}, ${note}`);
    //     //         agent.context.delete('answers-followup');
    //     //     }
    //     //     else checkFallback(agent);
    //     // }
    // });
}

// Checking the incorrect answer of user in 4 answers
function checkFallback(agent) {
    var ran = randomInt(0,4);
    //var context = agent.getContext('answers-followup');

    var userAnswer = agent.parameters.any;
    var text1 = `Quelle est votre bonne réponse ?`;
    var text2 = `Votre réponse est ?`;
    var text3 = `Choisissez une réponse ci-dessous`;
    var text4 = `Choisissez la bonne réponse, s'il vous plaît`;
    return ref.once(`value`).then((snapshot)=>{
        //var question = snapshot.child(`questions/${ID}`).val();
        var answer0 = snapshot.child(`answers/${ID}/0`).val();
        var answer1 = snapshot.child(`answers/${ID}/1`).val();
        var answer2 = snapshot.child(`answers/${ID}/2`).val();
        var answer3 = snapshot.child(`answers/${ID}/3`).val();
        // eslint-disable-next-line promise/always-return
        if(userAnswer !== answer0 || userAnswer !== answer1 || userAnswer !== answer2 || userAnswer !== answer3)
        {
            switch(ran)
            {
                case 0: agent.add(text1);
                        agent.add(new Suggestion(`${answer0}`));
                        agent.add(new Suggestion(`${answer1}`));
                        agent.add(new Suggestion(`${answer2}`));
                        agent.add(new Suggestion(`${answer3}`));
                        break;
                case 1: agent.add(text2);
                        agent.add(new Suggestion(`${answer0}`));
                        agent.add(new Suggestion(`${answer1}`));
                        agent.add(new Suggestion(`${answer2}`));
                        agent.add(new Suggestion(`${answer3}`));
                        break;
                case 2: agent.add(text3);
                        agent.add(new Suggestion(`${answer0}`));
                        agent.add(new Suggestion(`${answer1}`));
                        agent.add(new Suggestion(`${answer2}`));
                        agent.add(new Suggestion(`${answer3}`));
                        break;
                case 3: agent.add(text4);
                        agent.add(new Suggestion(`${answer0}`));
                        agent.add(new Suggestion(`${answer1}`));
                        agent.add(new Suggestion(`${answer2}`));
                        agent.add(new Suggestion(`${answer3}`));
                        break; 
            }
        }

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
            agent.add(new Suggestion(`Suivant`));
            agent.add(new Suggestion(`Annuler`));
        }
    });
}

// Default welcome when start to the conversation
function welcome(agent) {
//     return async (dispatch) => {
//     try {
//         let url = `https://graph.facebook.com/v5.0/me?fields=id%2Cname&access_token=EAADLSmoiLyMBAD5DRyoXMVMkkOAPT6eCbMiJ15FgCLXpZCRrGGZCiIUeZC9ejvzZBVZAeNt8xFZA6E5oFESTQIZBrrYsVqTnOhiC56ZAeVgBcy2gqE3PDLP3eAc0oKkZCwvUe5BIdRLfIrffokpk36JdYjNpm8NvP9jV0Vw9y2uSUje3LhrO7TD0B4zI6wwRZAq24ZD`;
//         const response = await axios.get(url)
//         let user = response.data
//         // var responseText = `Hi there ${user.first_name}, How can i help you today?`
//         // Send Your response
//         console.log(user);
//         if (user === null){
//             agent.add(`Hi there ${user.first_name}, How can i help you today?`);
//         }
//     } catch (error) {
//         console.log("caught", error);
//     }
//    }
    agent.add(`Bonjour ${{user_full_name}}, que voulez-vous faire ?`); // Greeting to the facebook messenger user name
    agent.add(new Suggestion(`Random Question`));
    agent.add(new Suggestion(`Talk 4 For`));
}

// Default fallback when the chatbot did not understand
function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
 
  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // Just testing
  function test(agent) {
    agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
    agent.add(new Card({
        title: `Title: this is a card title`,
        imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
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
//intentMap.set('Default Fallback Intent', fallback);
intentMap.set('Test', test);
intentMap.set('Random', askRandom);
intentMap.set('Answers', checkAnswer);
intentMap.set('Answers - fallback', checkFallback);
intentMap.set('Idioms', talk4For);
agent.handleRequest(intentMap);
});

