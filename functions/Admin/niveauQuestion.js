const variables = require('../variables');
const index = require('../index');

function niveauQuestion (agent){
    var niveauTotale;
    var questionTotale
    // eslint-disable-next-line promise/always-return
    return variables.ref.once(`value`).then((snapshot)=>{
        const {niveau} = agent.parameters;
        niveauTotale = snapshot.child(`TCFNiveauDesQuestions/${niveau}`).numChildren();
        questionTotale = snapshot.child(`TCFquestions`).numChildren();
        variables.ref.child(`TCFNiveauDesQuestions/${niveau}/${niveauTotale}`).set(questionTotale);
        agent.add(`Succès, écrivez la question`);
    });
}
module.exports = niveauQuestion;