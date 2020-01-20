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
const {Card, Suggestion} = require('dialogflow-fulfillment');
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

var ID = randomInt(0,4)

function randomQ(agent)
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
            agent.add(`[${ID+1}] - ${question}`);
            agent.add(new Suggestion(`${answer0}`));
            agent.add(new Suggestion(`${answer1}`));
            agent.add(new Suggestion(`${answer2}`));
            agent.add(new Suggestion(`${answer3}`));
            //agent.add(`La bonne réponse est ${correct}`);
            //agent.add(`${note}`);
        }
    });
}


function checkAnswer(agent)
{
    return ref.once(`value`).then((snapshot)=>{
        var note = snapshot.child(`notes/${ID}`).val();
        var correct = snapshot.child(`corrects/${ID}`).val();
        // eslint-disable-next-line promise/always-return
        if(question !== null)
        {
            agent.add(`[${ID+1}] - ${question}`);
            agent.add(new Suggestion(`${answer0}`));
            agent.add(new Suggestion(`${answer1}`));
            agent.add(new Suggestion(`${answer2}`));
            agent.add(new Suggestion(`${answer3}`));
            //agent.add(`La bonne réponse est ${correct}`);
            //agent.add(`${note}`);
        }
    });
}
 

function welcome(agent) {
 
    //agent.add(`Bonjour ${user_full_name}, comment allez-vous?`);
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
    agent.add(`Bonjour`+ `Comment allez-vous ?`);
}
 
function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
 
  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
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
intentMap.set('Random', randomQ);
// intentMap.set('your intent name here', googleAssistantHandler);
agent.handleRequest(intentMap);
});

