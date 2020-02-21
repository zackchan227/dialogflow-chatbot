const variables = require('../variables');
const index = require('../index');

function contexteQuestion (agent){
    var questionTotale;
    // eslint-disable-next-line promise/always-return
    return variables.ref.once(`value`).then((snapshot)=>{
        const {contexte} = agent.parameters;
        questionTotale = snapshot.child(`TCFquestions`).numChildren();
        variables.admin.database().ref('data/TCFquestions').child(`${questionTotale}`).set(`${contexte}`);
        agent.add(`N.${questionTotale}: ${contexte}`);
        agent.add(`Succès, écrivez la première réponse: `);
    });
} 
module.exports = contexteQuestion;