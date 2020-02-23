const variables = require('../variables');
const index = require('../index');

function reponseCorrect (agent){
    var questionID;
    // eslint-disable-next-line promise/always-return
    return variables.ref.once(`value`).then((snapshot)=>{
        const {correct} = agent.parameters;
        questionID = snapshot.child(`questionID/${index.user_id}`).val();
        variables.admin.database().ref('data/TCFcorrects').child(`${questionID}`).set(`${correct}`);
        agent.add(`Bonne réponse: ${correct}`);
        agent.add(`Succès, écrivez l'explication: `);
    });
} 
module.exports = reponseCorrect;