const variables = require('../variables');
const index = require('../index');

const {Card, Suggestion} = require('dialogflow-fulfillment');

function niveauQuestion (agent){
    var niveauTotale;
    var questionTotale
    // eslint-disable-next-line promise/always-return
    return variables.ref.once(`value`).then((snapshot)=>{
        const {niveau} = agent.parameters;
        niveauTotale = snapshot.child(`TCFNiveauDesQuestions/${niveau}`).numChildren();
        questionTotale = snapshot.child(`TCFquestions`).numChildren();
        variables.ref.child(`TCFNiveauDesQuestions/${niveau}/${niveauTotale}`).set(`${questionTotale}`);
        variables.ref.child(`questionID/${index.user_id}`).set(`${questionTotale}`);
        agent.add(`Succès, écrivez la question: `);
    });
}
module.exports = niveauQuestion;