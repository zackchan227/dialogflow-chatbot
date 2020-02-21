const variables = require('../variables');
const index = require('../index');

function R2 (agent){
    var questionTotale;
    // eslint-disable-next-line promise/always-return
    return variables.ref.once(`value`).then((snapshot)=>{
        const {r2} = agent.parameters;
        questionTotale = snapshot.child(`TCFquestions`).numChildren();
        questionTotale--;
        variables.admin.database().ref('data/TCFanswers').child(`${questionTotale}/1`).set(`${r2}`);
        agent.add(`Deuxième réponse: ${r2}`);
        agent.add(`Succès, écrivez la troisième réponse: `);
    });
} 
module.exports = R2;