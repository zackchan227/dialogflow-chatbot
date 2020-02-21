const variables = require('../variables');
const index = require('../index');

function R4 (agent){
    var questionTotale;
    // eslint-disable-next-line promise/always-return
    return variables.ref.once(`value`).then((snapshot)=>{
        const {r4} = agent.parameters;
        questionTotale = snapshot.child(`TCFquestions`).numChildren();
        questionTotale--;
        variables.admin.database().ref('data/TCFanswers').child(`${questionTotale}/3`).set(`${r4}`);
        agent.add(`Réponse finale: ${r4}`);
        agent.add(`Succès, écrivez la bonne réponse: `);
    });
} 
module.exports = R4;