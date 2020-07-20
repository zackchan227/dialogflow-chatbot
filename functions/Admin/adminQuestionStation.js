const variables = require('../variables');
const index = require('../index');

const {Card, Suggestion} = require('dialogflow-fulfillment');

function adminQuestionStation (agent){
    var i,j;
    var maxUser, key, maxQuestion;
    var question, reponse;
    var flag = false;
    // eslint-disable-next-line promise/always-return
    return variables.admin.database().ref('contactez-Nous').once(`value`).then((snapshot)=>{
        maxUser = snapshot.numChildren();
        // eslint-disable-next-line promise/always-return
        for(i = 0; i < maxUser; i++) {
            key = Object.keys(snapshot.val())[i];
            maxQuestion = snapshot.child(`${key}`).numChildren();
            for(j = 0; j < maxQuestion; j++) {
                question = snapshot.child(`${key}/${j}/Question`).val();
                reponse = snapshot.child(`${key}/${j}/R`).val();
                if(question !== null && reponse === null) {        
                    flag = true;
                    break;
                }
            }
            if(flag === true)
                break;
        }
        // eslint-disable-next-line promise/always-return
        if(flag === true) {
            variables.admin.database().ref('contactez-Nous').child(`reponseStatut/${index.user_id}/${key}`).set(j);
            agent.add(`Question: ${question}`);
        }
        else {
            const quickRepliesAnnuler = new Suggestion({
                title: "Aucune question n'a besoin d'être répondue",
                reply: "Annuler"
            })
            agent.add(quickRepliesAnnuler);
        }
    });
}
module.exports = adminQuestionStation;