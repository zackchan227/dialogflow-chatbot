const variables = require('../variables');
const index = require('../index');

function contexteQuestion (agent){
    var questionID;
    // eslint-disable-next-line promise/always-return
    return variables.ref.once(`value`).then((snapshot)=>{
        const {contexte} = agent.parameters;
        questionID = snapshot.child(`questionID/${index.user_id}`).val();
        variables.admin.database().ref('data/TCFquestions').child(`${questionID}`).set(`${contexte}`);
        agent.add(`N.${questionID}: ${contexte}`);
        agent.add(`Succès, écrivez la première réponse: `);
    });
} 
module.exports = contexteQuestion;