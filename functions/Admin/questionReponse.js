/* eslint-disable prefer-arrow-callback */
/* eslint-disable promise/always-return */
/* eslint-disable promise/no-nesting */
const variables = require('../variables');
const index = require('../index');

const {Card, Suggestion} = require('dialogflow-fulfillment');

function questionReponse(agent) {
    var key, question;
    // eslint-disable-next-line promise/always-return
    return variables.admin.database().ref('contactez-Nous').once(`value`).then((snapshot)=>{
        const { reponse } = agent.parameters;
        key = Object.keys(snapshot.child(`reponseStatut/${index.user_id}`).val())[0];
        question = snapshot.child(`reponseStatut/${index.user_id}/${key}`).val();
        variables.admin.database().ref('contactez-Nous').child(`${key}/${question}/R`).set(reponse);

        var remove = variables.admin.database().ref(`contactez-Nous/reponseStatut/${index.user_id}`)
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

        const quickRepliesReponse = new Suggestion({
            title: `Votre réponse: ${reponse}`,
            reply: "Annuler"
        })
        agent.add(quickRepliesReponse);
    });
}
module.exports = questionReponse;