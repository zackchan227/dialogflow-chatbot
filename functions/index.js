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
const translate = require('google-translate-api');
const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();
lngDetector.setLanguageType("iso2");
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
    const ID = randomInt(0,7); // Global random seed for question's ID

   function saveID(id)
   {
       return id;
   }

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
            agent.add(`Votre réponse est "${ans}"`);
            // eslint-disable-next-line promise/always-return
            for(var i = 0; i < 7; i++){
                var CorrectAnswer = snapshot.child(`corrects/${i}`).val();
                if(ans === CorrectAnswer) {
                    agent.add(`C'est Correct :D`);                    
                    correctNumber = i;                             
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
            //eslint-disable-next-line promise/always-return
            if(check !== true){ 
                agent.add(`Ce n'est pas correct :(`);              
                correctAnswer = snapshot.child(`corrects/${correctNumber}`).val();
                agent.add(`La bonne réponse est ${correctAnswer}`); 
                                                                               
            }       
            // eslint-disable-next-line promise/always-return
            explication = snapshot.child(`notes/${correctNumber}`).val();
            agent.add(`${explication}`);

            agent.add(new Suggestion(`Continuer`));
            agent.add(new Suggestion(`Annuler`));         
        });       
    }

    function testCheck(agent)
    {
        var ref = admin.database().ref(`data/corrects`);
        return ref.orderByValue.once("value", function(snapshot) {
            var a = agent.parameters['answer'];
            snapshot.forEach(function(data) {
              console.log("The " + data.key + " dinosaur's score is " + data.val());
                if(a === data.val()){
                    agent.add(`La réponse ${data.val()} pour la question ${data.key} est correct`);
                }
            });
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

    function translateTo(agent){
        var userInput = agent.parameters['any'];
        var userLang = agent.parameters['language'];
        var detect = lngDetector.detect(`${userInput}`,1);
        var lang;
        switch(`${userLang}`){
            case "Anglais": lang = 'en'; break;
            case "Chinois": lang = 'cn'; break;
            case "Français": lang = 'fr'; break;
            case "Vietnamien": lang = 'vi'; break;
        }
        agent.add(`Your language is ${detect[0]}`);
        // eslint-disable-next-line promise/always-return
        return translate(`${userInput}`, {to: `${lang}`}).then(res => {
            // Note that res.from.text will only be returned if from.text.autoCorrected 
            // or from.text.didYouMean equals to true.
            var text = res.text; // user input to translate return string
            var autoCorrected = res.from.text.autoCorrected; // correct the user input return true-false
            var value = res.from.text.value; // user input to translate that has corrected return string
            var didYouMean = res.from.text.didYouMean; // same as auto corrected
            var iso = res.from.language.iso; // return language's iso code - 2 characters
            var detect = lngDetector.detect(`${userInput}`,1);
            // eslint-disable-next-line promise/always-return
            if(value !== null){
                agent.add(`${text} with auto corrected = ${autoCorrected} and did you mean = ${didYouMean}`);
                agent.add(`This is translation language's iso code ${iso}`);
                agent.add(`This is user input language's iso code ${detect[0]}`);
                agent.add(`${userInput} en ${lang} = ${value}`);
                agent.add(`${text}(${detect[0]}) = ${value}(${iso})`);
            }
 
        });
    }

    // function languageHandle(agent){
    //     agent.add(`Dans quelle langue voulez-vous traduire?`);
    //     agent.add(new Suggestion(`Anglais`));
    //     agent.add(new Suggestion(`Chinois`));
    //     agent.add(new Suggestion(`Français`));
    //     agent.add(new Suggestion(`Vietnamien`));
    // }

    // function textHandle(agent){
    //     agent.add("Entrez votre text, svp.");
    // }

    // app.get('/get_fb_profile', function(req, res) {
    //     oauth2.get("https://graph.facebook.com/me", req.session.accessToken, function(err, data ,response) {
    //      if (err) {
    //       console.error(err);
    //       res.send(err);
    //      } else {
    //       var profile = JSON.parse(data);
    //       console.log(profile);
    //       var profile_img_url = "https://graph.facebook.com/"+profile.id+"/picture";
    //      }
    //     });
    // });

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
        var user_full_name = ["chienne","putain", "stupide", "putang ina mo"];
        var ran = randomInt(0,4);
        agent.add(`Bonjour ${user_full_name[ran]}, que voulez-vous faire ?`); // Greeting to the facebook messenger user name
        agent.add(new Suggestion(`Random Question`));
        agent.add(new Suggestion(`Translate`));
        agent.add(new Suggestion(`Talk 4 For`));
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
    //intentMap.set('Text', textHandle);
    //intentMap.set('Language', languageHandle);
    intentMap.set('Translate', translateTo);
    agent.handleRequest(intentMap);
});

