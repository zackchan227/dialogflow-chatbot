const variables = require('../variables');
const index = require('../index');
const {Card, Suggestion} = require('dialogflow-fulfillment');

// Vérification de la bonne réponse de l'utilisateur en 4 réponses
function questionsCheck(agent)
{
    return variables.ref.once(`value`).then((snapshot)=>{
        // Cette variable identifie le joueur participant au paquet de questions initiales (questions) 
        // ou au paquet de questions TCF (TCFquestions)
        var nouvelOuPas;

        // Cette variable vérifie si le joueur a vérifié son niveau
        var testDeNiveau = snapshot.child(`levelTest/${index.user_id}`).val();
        if(testDeNiveau === 2)
            nouvelOuPas="TCF";
        else
            nouvelOuPas="";

        // Réponse du joueur
        var ans = agent.parameters['answer'];

        // Question actuelle est posée
        var currentQuestion = snapshot.child(`CurrentQuestion/${index.user_id}`).val();

        // La bonne réponse à la question
        var correctA = snapshot.child(`${nouvelOuPas}corrects/${currentQuestion}`).val();

        // Explication de la bonne réponse
        var explication = snapshot.child(`${nouvelOuPas}notes/${currentQuestion}`).val();

        // Score du joueur
        var score = snapshot.child(`scores/${index.user_id}`).val();

        // Niveau du joueur
        var niveau;

        // Cette variable vérifie si la réponse du joueur est bonne ou fausse
        var check = false;

        // Vérifie si la réponse du joueur est bonne ou fausse
        if(ans === correctA) {
            check = true;
        }

        // Calculer le score du joueur
        if(ans === 'je ne sais pas' || ans === 'Je ne sais pas' || ans === 'sais pas' 
        || ans === 'idk' || ans === 'dont know' || ans === `don't know` || ans === 'who knows' 
        || ans === 'không biết' || ans === 'đéo biết'){
            agent.add(`Essayez d'y répondre, ne vous inquiétez pas de l'échec 🤗`);
        }
        else if(check === true){
            agent.add(`⭕ C'est Correct :D`);    
            agent.add(`${explication}`);
            if(testDeNiveau === 0) 
                switch(currentQuestion){ //x10 quand prêt
                    case 0:
                        score += 20;
                        break;
                    case 1:
                        score += 20;
                        break;
                    case 2:
                        score += 25;
                        break;
                    case 3:
                        score += 25;
                        break;
                    case 4:
                        score += 30;
                        break;
                    case 5:
                        score += 30;
                        break;
                    case 6:
                        score += 30;
                        break;
                    case 7:
                        score += 35;
                        break;
                    case 8:
                        score += 35;
                        break;
                    case 9:
                        score += 35;
                        break;
                    default:
                        score += 25;
                        break;
                }
            else
                score += 25;
            variables.admin.database().ref('data/scores').child(`${index.user_id}`).set(score);
        }
        //eslint-disable-next-line promise/always-return
        else if(check !== true && explication !== null){ 
            agent.add(`❌ Ce n'est pas correct :(`);              
            agent.add(`La bonne réponse est: "${correctA}"`);    
            agent.add(`Explication: ${explication}`);
            if(testDeNiveau === 2)
                score -= 25;
            variables.admin.database().ref('data/scores').child(`${index.user_id}`).set(score);                                                                                        
        }       
        else {
            agent.add(`Pardon, il y a une erreur, réessayez!`);   
        }
        
        // eslint-disable-next-line promise/always-return
        if(testDeNiveau === 1) {
            if(score < 500)
                niveau = "🇦1️⃣";

            if(score >= 500 && score < 1000)
                niveau = "🇦2️⃣";

            if(score >=1000 && score < 1500)
                niveau = "🇧1️⃣";

            if(score >=1500 && score < 2000)
                niveau = "🇧2️⃣";

            if(score >=2000 && score < 2500)
                niveau = "🇨1️⃣";

            if(score >=2500 && score <= 3000)
                niveau = "🇨2️⃣";
            
            // Réponse rapide pour la fin du test de niveau
            const quickRepliesFinish = new Suggestion({
                title: `Votre niveau est ${niveau} `,
                reply: "Annuler"
            })
            agent.add(`Vous avez terminé votre premier test de niveau.`);
            agent.add(`Votre score est: ${score}`);
            variables.admin.database().ref('data/AskRandomQ').child(`${index.user_id}/9`).set('False');   
            variables.admin.database().ref('data/levelTest').child(`${index.user_id}`).set(2);
            agent.add(quickRepliesFinish);
        }
        else
            agent.add(variables.quickRepliesQChange);
    });       
}

module.exports = questionsCheck;