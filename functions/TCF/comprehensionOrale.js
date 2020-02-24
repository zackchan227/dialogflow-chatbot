const variables = require('../variables');
const index = require('../index');
const { WebhookClient, Image } = require('dialogflow-fulfillment');
const {Payload} = require('dialogflow-fulfillment');

function comprehensionOrale (agent){
    // eslint-disable-next-line promise/always-return
    return variables.ref.once(`value`).then((snapshot)=>{
        var audioURL = snapshot.child(`audio/0/url`)
        const payload ={ 
          "data": {
            "facebook": {
              "attachment": {
                "payload": {
                  "url": `${audioURL}`
                },
                "type": "audio"
              },
              "text": "This is audio url"
            } 
          }
        }
        sendResponse(payload);
          agent.add(
            new Payload(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true})
          );
    });
} 
module.exports = comprehensionOrale;