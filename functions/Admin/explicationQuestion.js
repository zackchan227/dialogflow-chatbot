const variables = require('../variables');
const index = require('../index');

const {Card, Suggestion} = require('dialogflow-fulfillment');

function explicationQuestion (agent){
    var questionID;
    // eslint-disable-next-line promise/always-return
    return variables.ref.once(`value`).then((snapshot)=>{
        const {explication} = agent.parameters;
        questionID = snapshot.child(`questionID/${index.user_id}`).val();
        variables.admin.database().ref('data/TCFnotes').child(`${questionID}`).set(`${explication}`);
        agent.add(`Explication: ${explication}`);
        var remove = variables.admin.database().ref(`data/questionID/${index.user_id}`)
        // eslint-disable-next-line promise/no-nesting
        // eslint-disable-next-line promise/always-return
        remove.remove()
        // eslint-disable-next-line prefer-arrow-callback
        // eslint-disable-next-line promise/always-return
        .then(function() {
            console.log("Remove succeeded.")
        })
        .catch(function(error) {
            console.log("Remove failed: " + error.message)
        });
        const quickRepliesFini = new Suggestion({
            title: `Succès, votre question a été ajoutée à la base de données.`,
            reply: "Je suis admin"
        });
        quickRepliesFini.addReply_("Annuler");
        agent.add(quickRepliesFini);
    });
} 
module.exports = explicationQuestion;