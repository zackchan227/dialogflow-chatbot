const variables = require('../variables');
const index = require('../index');

function R3 (agent){
    var questionID;
    // eslint-disable-next-line promise/always-return
    return variables.ref.once(`value`).then((snapshot)=>{
        const {r3} = agent.parameters;
        questionID = snapshot.child(`questionID/${index.user_id}`).val();
        variables.admin.database().ref('data/TCFanswers').child(`${questionID}/2`).set(`${r3}`);
        agent.add(`Troisième réponse: ${r3}`);
        agent.add(`Succès, écrivez la réponse finale: `);
    });
} 
module.exports = R3;