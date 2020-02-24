const variables = require('../variables');
const index = require('../index');
const { WebhookClient, Image } = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

function comprehensionEcrite (agent){
    return variables.ref.once(`value`).then((snapshot)=>{
        var code = snapshot.child('TCFimages/B1/35').val();
        agent.add(new Image(`https://i.imgur.com/${code}.jpg`));
        var question = snapshot.child(`TCFquestions/35`).val();
        var answer0 = snapshot.child(`TCFanswers/35/0`).val();
        var answer1 = snapshot.child(`TCFanswers/35/1`).val();
        var answer2 = snapshot.child(`TCFanswers/35/2`).val();
        var answer3 = snapshot.child(`TCFanswers/35/3`).val();
        
        // eslint-disable-next-line promise/always-return
        if(question !== null) {
            agent.add(`${question}`);
            agent.add(`${answer0}`);
            agent.add(`${answer1}`);
            agent.add(`${answer2}`);
            const quickReplies1 = new Suggestion({
                title: `${answer3}`,
                reply: `A`
            })
            quickReplies1.addReply_(`B`);
            quickReplies1.addReply_(`C`);
            quickReplies1.addReply_(`D`);
    
            agent.add(quickReplies1);
        }
    });
} 
module.exports = comprehensionEcrite;