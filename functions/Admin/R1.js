const variables = require('../variables');
const index = require('../index');

function R1 (agent){
    var questionTotale;
    // eslint-disable-next-line promise/always-return
    return variables.ref.once(`value`).then((snapshot)=>{
        const {r1} = agent.parameters;
        questionTotale = snapshot.child(`TCFquestions`).numChildren();
        questionTotale--;
        variables.admin.database().ref('data/TCFanswers').child(`${questionTotale}/0`).set(`${r1}`);
        agent.add(`Première réponse: ${r1}`);
        agent.add(`Succès, écrivez la deuxième réponse: `);
    });
} 
module.exports = R1;