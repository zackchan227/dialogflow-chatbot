const variables = require('../variables');
const index = require('../index');
const { WebhookClient, Image } = require('dialogflow-fulfillment');
const functions = require('firebase-functions');
var request1 = require('request')
const {Card, Suggestion, Payload} = require('dialogflow-fulfillment');

function comprehensionOrale (agent){
    // eslint-disable-next-line promise/always-return
    return variables.ref.once(`value`).then((snapshot)=>{
        const payload = {
            "facebook": {
                  "attachment": {
                    "type": "audio",
                    "payload": {
                      "url": "https://drive.google.com/u/0/uc?id=1HfxHJLz_QOCdE0LurEQsEDAl3L-Fp8Aa&export=download"
                    }
                  }  
            }
          }
          
          agent.add(
            new Payload(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true})
          );
    });
} 
module.exports = comprehensionOrale;