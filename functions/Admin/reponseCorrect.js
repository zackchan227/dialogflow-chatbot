const variables = require('../variables');
const index = require('../index');

function reponseCorrect (agent){
    var questionTotale;
    // eslint-disable-next-line promise/always-return
    return variables.ref.once(`value`).then((snapshot)=>{
        const {correct} = agent.parameters;
        questionTotale = snapshot.child(`TCFquestions`).numChildren();
        questionTotale--;
        variables.admin.database().ref('data/TCFcorrects').child(`${questionTotale}`).set(`${correct}`);
        agent.add(`Bonne réponse: ${correct}`);
        agent.add(`Succès, écrivez l'explication: `);
    });
} 
module.exports = reponseCorrect;