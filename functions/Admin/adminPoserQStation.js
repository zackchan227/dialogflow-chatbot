const variables = require('../variables');
const index = require('../index');

const {Card, Suggestion} = require('dialogflow-fulfillment');

function adminPoserQStation (agent){
    agent.add(`N'interrompez pas l'application lorsque vous ajoutez une question.`);

    const quickRepliesNiveau = new Suggestion({
        title: `Quel est le niveau de votre question?`,
        reply: "A1"
    });
    quickRepliesNiveau.addReply_("A2");
    quickRepliesNiveau.addReply_("B1");
    quickRepliesNiveau.addReply_("B2");
    quickRepliesNiveau.addReply_("C1");
    quickRepliesNiveau.addReply_("C2");
    quickRepliesNiveau.addReply_("Annuler");
    agent.add(quickRepliesNiveau);
}
module.exports = adminPoserQStation;