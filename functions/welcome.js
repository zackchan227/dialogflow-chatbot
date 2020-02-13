const variables = require('./variables');
const index = require('./index');

//Quick Reply 2
const {Card, Suggestion} = require('dialogflow-fulfillment');
const quickReplies2F = new Suggestion({
    title: "Que-voulez vous faire?",
    reply: "TCF Question"
})
quickReplies2F.addReply_("Outils");
quickReplies2F.addReply_("Divertissement");
quickReplies2F.addReply_("Contacte l'admin");

const welcome = (agent) => {
    agent.add(`Welcome to my agent! ${index.user_id}`);
    agent.add(quickReplies2F);
}
module.exports = welcome;