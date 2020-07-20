const variables = require('../variables');
const index = require('../index');

function R2 (agent){
    var questionID;
    // eslint-disable-next-line promise/always-return
    return variables.ref.once(`value`).then((snapshot)=>{
        const {r2} = agent.parameters;
        questionID = snapshot.child(`questionID/${index.user_id}`).val();
        variables.admin.database().ref('data/TCFanswers').child(`${questionID}/1`).set(`${r2}`);
        agent.add(`Deuxième réponse: ${r2}`);
        agent.add(`Succès, écrivez la troisième réponse: `);
    });
} 
module.exports = R2;