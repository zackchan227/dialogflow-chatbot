/* eslint-disable prefer-arrow-callback */
/* eslint-disable promise/always-return */
/* eslint-disable promise/no-nesting */
const variables = require('../variables');
const index = require('../index');

const {Card, Suggestion} = require('dialogflow-fulfillment');

function regarderResponses(agent) {
    const { numero } = agent.parameters;
    // eslint-disable-next-line promise/always-return
    return variables.admin.database().ref('contactez-Nous').once(`value`).then((snapshot)=>{
        var question = snapshot.child(`${index.user_id}/${numero}/Question`).val();
        var réponse = snapshot.child(`${index.user_id}/${numero}/R`).val();
        agent.add(`[${numero}] Votre question: ${question}`);
        agent.add(`Notre réponse: ${réponse}`);
        var remove = variables.admin.database().ref(`contactez-Nous/${index.user_id}/${numero}`)
        // eslint-disable-next-line promise/no-nesting
        // eslint-disable-next-line promise/always-return
        remove.remove()
        // eslint-disable-next-line promise/always-return
        // eslint-disable-next-line prefer-arrow-callback
        .then(function() {
            console.log("Remove succeeded.")
        })
        .catch(function(error) {
            console.log("Remove failed: " + error.message)
        });
        const quickRepliesQuestionU = new Suggestion({
            title: `Que voulez-vous faire ensuite?`,
            reply: "Nouvelle question"
        });
        quickRepliesQuestionU.addReply_("Autres Réponses");
        quickRepliesQuestionU.addReply_("Annuler");
        agent.add(quickRepliesQuestionU);
    });
}
module.exports = regarderResponses;