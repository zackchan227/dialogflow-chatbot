const variables = require('../variables');
const index = require('../index');
const {Card, Suggestion} = require('dialogflow-fulfillment');

// Station de gestion des questions TCF
function TCFStation(agent) {
    return variables.ref.once(`value`).then((snapshot)=>{
        // Score du joueur
        var score = snapshot.child(`scores/${index.user_id}`).val();

        // Niveau du joueur
        var niveau;

        // Cette variable vérifie si le joueur a vérifié son niveau
        var testDeNiveau = snapshot.child(`levelTest/${index.user_id}`).val();

        // Nombre de questions complétées
        var fini = 0;

        // Cette variable vérifie si la question a été posée
        var verQuestion;

        // eslint-disable-next-line promise/always-return
        if(score === null || testDeNiveau === 0) {
            if(score === null)
                variables.admin.database().ref('data/scores').child(`${index.user_id}`).set(0);
            variables.admin.database().ref('data/levelTest').child(`${index.user_id}`).set(0);
            for(var i = 0; i< 10; i++){
                verQuestion = snapshot.child(`AskRandomQ/${index.user_id}/${i}`).val();
                if(verQuestion === "True") {
                    fini++;   
                }
            }
            // Réponse rapide pour les premières questions
            const quickRepliesFirstTime = new Suggestion({
                title: `C'est la première fois que vous utilisez cette application, vous devez passer un examen pour tester votre niveau. Fini: ${fini}/10`,
                reply: "On y va"
            })
            quickRepliesFirstTime.addReply_("Annuler");
            agent.add(quickRepliesFirstTime);
        } else {
            if(score < 500)
                niveau = "A1";

            if(score >= 500 && score < 1000)
                niveau = "A2";

            if(score >=1000 && score < 1500)
                niveau = "B1";

            if(score >=1500 && score < 2000)
                niveau = "B2";

            if(score >=2000 && score < 2500)
                niveau = "C1";

            if(score >=2500 && score <= 3000)
                niveau = "C2";
            
            agent.add(`Votre niveau est: ${niveau}`);
            agent.add(`Votre score est: ${score}`);
            agent.add(variables.quickRepliesQCommencer);
        }
    });
}
module.exports = TCFStation;