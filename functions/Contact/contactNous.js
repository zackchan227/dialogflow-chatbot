const variables = require('../variables');
const index = require('../index');

const {Card, Suggestion} = require('dialogflow-fulfillment');

function contactNous(agent) {
    const { question } = agent.parameters;
    var position;
    var i;
    return variables.admin.database().ref('contactez-Nous').once(`value`).then((snapshot)=>{
        // eslint-disable-next-line promise/always-return
        for(i = 0; i < 100; i++)
            if(snapshot.child(`${index.user_id}/${i}`).val() === null) {
                position = i;
                break;
            }
        variables.admin.database().ref('contactez-Nous').child(`${index.user_id}/${position}/Question`).set(question); 
        agent.add(`Votre question a été envoyée. Nous répondrons à votre question dans les plus brefs délais. N'oubliez pas votre numéro de question pour voir notre réponse.`);
        agent.add(`Votre numero de question: ${position}`);
        const quickRepliesQuestionU = new Suggestion({
            title: `Que voulez-vous faire ensuite?`,
            reply: "Nouvelle question"
        });
        quickRepliesQuestionU.addReply_("Annuler");
        agent.add(quickRepliesQuestionU); 
    });    
}
module.exports = contactNous;