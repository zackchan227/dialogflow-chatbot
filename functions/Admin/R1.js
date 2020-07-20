const variables = require('../variables');
const index = require('../index');

function R1 (agent){
    var questionID;
    // eslint-disable-next-line promise/always-return
    return variables.ref.once(`value`).then((snapshot)=>{
        const {r1} = agent.parameters;
        questionID = snapshot.child(`questionID/${index.user_id}`).val();
        variables.admin.database().ref('data/TCFanswers').child(`${questionID}/0`).set(`${r1}`);
        agent.add(`Première réponse: ${r1}`);
        agent.add(`Succès, écrivez la deuxième réponse: `);
    });
} 
module.exports = R1;