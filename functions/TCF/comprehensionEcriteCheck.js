const variables = require('../variables');
const index = require('../index');
const { WebhookClient, Image } = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

function comprehensionEcriteCheck (agent){
    return variables.ref.once(`value`).then((snapshot)=>{
        // Réponse du joueur
        var reponse = agent.parameters['reponse'];

        // La bonne réponse à la question
        var correctA = snapshot.child(`TCFcorrects/35`).val();

        // Explication de la bonne réponse
        var explication = snapshot.child(`TCFnotes/35`).val();

        // Cette variable vérifie si la réponse du joueur est bonne ou fausse
        var check = false;

        // Vérifie si la réponse du joueur est bonne ou fausse
        if(reponse === correctA) {
            check = true;
        }

        //eslint-disable-next-line promise/always-return
        if(check === true){
            agent.add(`⭕ C'est Correct :D`);    
            agent.add(`${explication}`);
        }
        else {
            agent.add(`❌ Ce n'est pas correct :(`);              
            agent.add(`La bonne réponse est: "${correctA}"`);    
            agent.add(`Explication: ${explication}`);
        }
        agent.add(variables.quickRepliesQChange);
    });
} 
module.exports = comprehensionEcriteCheck;