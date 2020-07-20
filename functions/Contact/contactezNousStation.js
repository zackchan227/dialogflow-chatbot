const variables = require('../variables');
const index = require('../index');

const {Card, Suggestion} = require('dialogflow-fulfillment');

function contactezNousStation(agent){
    var responsePret = false;
    var nombre=0;
    var j;
    var quickRepliesQStation;
    return variables.admin.database().ref('contactez-Nous').once(`value`).then((snapshot)=>{
        agent.add("C'est votre station Q&R où vous pouvez demander à notre mentor votre problème.")
        for(j = 0; j < 100; j++)
            if(snapshot.child(`${index.user_id}/${j}/R`).val() !== null) {
                responsePret = true;
                nombre++;
            }
        // eslint-disable-next-line promise/always-return
        if(responsePret === true) {
            quickRepliesQStation = new Suggestion({
                title: `Il y a "${nombre}" de vos questions auxquelles nous avons répondu`,
                reply: "Nouvelle question"
            });
            quickRepliesQStation.addReply_("Mes questions");
            quickRepliesQStation.addReply_("Annuler");
        }
        else {
            quickRepliesQStation = new Suggestion({
                title: `Nous n'avons répondu à aucune de vos questions. Voulez-vous poser une question?`,
                reply: "Nouvelle question"
            });
            quickRepliesQStation.addReply_("Annuler");
        }
        agent.add(quickRepliesQStation);
    }); 
}
module.exports = contactezNousStation;