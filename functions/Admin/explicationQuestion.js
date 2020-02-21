const variables = require('../variables');
const index = require('../index');

const {Card, Suggestion} = require('dialogflow-fulfillment');

function explicationQuestion (agent){
    var questionTotale;
    // eslint-disable-next-line promise/always-return
    return variables.ref.once(`value`).then((snapshot)=>{
        const {explication} = agent.parameters;
        questionTotale = snapshot.child(`TCFquestions`).numChildren();
        questionTotale--;
        variables.admin.database().ref('data/TCFnotes').child(`${questionTotale}`).set(`${explication}`);
        agent.add(`Explication: ${explication}`);
        const quickRepliesFini = new Suggestion({
            title: `Succès, votre question a été ajoutée à la base de données.`,
            reply: "Je suis admin"
        });
        quickRepliesFini.addReply_("Annuler");
        agent.add(quickRepliesFini);
    });
} 
module.exports = explicationQuestion;