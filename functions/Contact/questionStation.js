const variables = require('../variables');
const index = require('../index');

const {Card, Suggestion} = require('dialogflow-fulfillment');

function questionStation(agent) {
    var responsePret=false;
    var i,j;
    return variables.admin.database().ref('contactez-Nous').once(`value`).then((snapshot)=>{
        for(j = 0; j < 100; j++)
            if(snapshot.child(`${index.user_id}/${j}/R`).val() !== null) {
                responsePret = true;
                break;
            }
        // eslint-disable-next-line promise/always-return
        if(responsePret === true) {
            const quickRepliesQuestionU = new Suggestion({
                title: `Donnez-nous le numéro de votre question!`,
                reply: `${j}`
            })
            for(i = j+1; i < 100; i++)
                if(snapshot.child(`${index.user_id}/${i}/R`).val() !== null) 
                    quickRepliesQuestionU.addReply_(`${i}`);
            quickRepliesQuestionU.addReply_("Annuler");
            agent.add(quickRepliesQuestionU);
        } else {
            const quickRepliesQuestionU = new Suggestion({
                title: `Désolé, vous n'avez aucune réponse de notre part`,
                reply: "Nouvelle question"
            });
            quickRepliesQuestionU.addReply_("Annuler");
            agent.add(quickRepliesQuestionU);
        }
    });   
}
module.exports = questionStation;