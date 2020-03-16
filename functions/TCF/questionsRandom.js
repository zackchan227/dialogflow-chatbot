const variables = require('../variables');
const index = require('../index');
const {Card, Suggestion, Image} = require('dialogflow-fulfillment');

function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
}

function randomIntAd(min, max, no1, no2, no3) {
    var random = randomInt(min, max);
    while(random === no1 || random === no2 || random === no3)
        random = randomInt(min, max);
    return random;
}

function questionsRandom(agent)
    {   
        return variables.ref.once(`value`).then((snapshot)=>{

            // Cette variable contient l'ID de la question
            var ID;

            // Score du joueur
            var score = snapshot.child(`scores/${index.user_id}`).val();

            // Cette variable vérifie si le joueur a vérifié son niveau
            var testDeNiveau = snapshot.child(`levelTest/${index.user_id}`).val();

            // Cette variable vérifie si la question a été posée
            var verQuestion;

            // Niveau du joueur
            var niveau;
            // Vérifier le niveau du joueur
            if(score < 500)
            niveau = "A1";
                else if(score >= 500 && score < 1000)
                        niveau = "A2";
                    else if(score >= 1000 && score < 1500)
                            niveau = "B1";
                        else if(score >= 1500 && score < 2000)
                                niveau = "B2";
                            else if(score >= 2000 && score < 2500)
                                    niveau = "C1";
                                    else
                                    niveau = "C2";

            // Nombre de questions (dans la base de données Firebase) 
            // Lorsque vous modifiez le nombre de questions dans la base de données, 
            // modifiez simplement cette variable, pas besoin d'modifiez le code.
            var nombreDeQuestion = snapshot.child(`TCFNiveauDesQuestions/${niveau}`).numChildren();

            // Cette variable est médiée pour changer la question
            var lvl;

            // Cette variable identifie le joueur participant au paquet de questions initiales (questions) 
            // ou au paquet de questions TCF (TCFquestions)
            var nouvelOuPas="";

            // Cette variable vérifie si le joueur a répondu à toutes les questions 
            // du questionnaire au niveau du joueur
            var sommeQuestion = 0;

            // Cette variable contient l'ID de la question, prise en charge de la variable ID
            var IDQuestion;

            // Variables temporaires pour les boucles
            var i,j;

            // Vérifiez si un nouveau joueur
            if(testDeNiveau === 0) {
                // si oui
                var fini = 0;
                // Poser 10 questions de test de niveau...
                for(i = 0; i< 10; i++){
                    fini++;
                    verQuestion = snapshot.child(`AskRandomQ/${index.user_id}/${i}`).val();
                    if(verQuestion !== "True") {
                        ID = i;
                        break;     
                    }
                }
                // Lorsque 10 questions sont terminées...
                if(fini === 10) {
                    variables.admin.database().ref('data/levelTest').child(`${index.user_id}`).set(1);
                    for(j = 0; j< 10; j++)
                        variables.admin.database().ref('data/AskRandomQ').child(`${index.user_id}/${j}`).set('False');   
                }
            } else {
                // si non
                   
                    // Ces 2 fonctions vérifient si le joueur a répondu à toutes les questions 
                    // du questionnaire au niveau du joueur
                    for(i = 0; i < nombreDeQuestion; i++) {
                        lvl = snapshot.child(`TCFNiveauDesQuestions/${niveau}/${i}`).val();
                        if(snapshot.child(`AskRandomQ/${index.user_id}/${lvl}`).val() === "True")
                            sommeQuestion++; 
                    }

                    if(sommeQuestion === (nombreDeQuestion-1))
                        for(j = 0; j < nombreDeQuestion; j++) {
                            lvl = snapshot.child(`TCFNiveauDesQuestions/${niveau}/${j}`).val();
                            if(snapshot.child(`AskRandomQ/${index.user_id}/${lvl}`).val() === "True")
                                variables.admin.database().ref('data/AskRandomQ').child(`${index.user_id}/${lvl}`).set('False');
                        }
                    
                    // Question aléatoire
                    IDQuestion = randomInt(0,nombreDeQuestion);
                    lvl = snapshot.child(`TCFNiveauDesQuestions/${niveau}/${IDQuestion}`).val();
                    verQuestion = snapshot.child(`AskRandomQ/${index.user_id}/${lvl}`).val();
    
                    var h = 1;
                    // Vérifier si la question a été posée
                    while(verQuestion === "True"){
                        IDQuestion = (IDQuestion + h*h) % nombreDeQuestion;
                        lvl = snapshot.child(`TCFNiveauDesQuestions/${niveau}/${IDQuestion}`).val();
                        verQuestion = snapshot.child(`AskRandomQ/${index.user_id}/${lvl}`).val();
                        h++
                        // admin.database().ref('data/AskRandomQ').child(`${user_id}/${IDQuestion}`).set('False');
                    }
                    
                    nouvelOuPas = "TCF";
                    ID = snapshot.child(`TCFNiveauDesQuestions/${niveau}/${IDQuestion}`).val();
                }

            var image = snapshot.child(`${nouvelOuPas}questions/${ID}/Image`).val();
        
            // Afficher la question
            variables.admin.database().ref('data/CurrentQuestion').child(`${index.user_id}`).set(ID);
            var question;
            var answer0;
            var answer1;
            var answer2;
            var answer3;
            // eslint-disable-next-line promise/always-return
            if(image !== null) {
                var code = snapshot.child(`${nouvelOuPas}questions/${ID}/Image`).val();
                agent.add(new Image(`https://i.imgur.com/${code}.jpg`));
                question = snapshot.child(`${nouvelOuPas}questions/${ID}/Question`).val();
                answer0 = snapshot.child(`${nouvelOuPas}answers/${ID}/0`).val();
                answer1 = snapshot.child(`${nouvelOuPas}answers/${ID}/1`).val();
                answer2 = snapshot.child(`${nouvelOuPas}answers/${ID}/2`).val();
                answer3 = snapshot.child(`${nouvelOuPas}answers/${ID}/3`).val();
            }
            else {
                question = snapshot.child(`${nouvelOuPas}questions/${ID}`).val();

                var random0 = randomInt(0, 4);
                var random1 = randomIntAd(0, 4, random0, null, null);
                var random2 = randomIntAd(0, 4, random0, random1, null);
                var random3 = randomIntAd(0, 4, random0, random1, random2);

                answer0 = snapshot.child(`${nouvelOuPas}answers/${ID}/${random0}`).val();
                answer1 = snapshot.child(`${nouvelOuPas}answers/${ID}/${random1}`).val();
                answer2 = snapshot.child(`${nouvelOuPas}answers/${ID}/${random2}`).val();
                answer3 = snapshot.child(`${nouvelOuPas}answers/${ID}/${random3}`).val();
            }

            // eslint-disable-next-line promise/always-return
            if(question !== null) {
                agent.add(`${question}`);
                if(image !== null) {
                    agent.add(`${answer0}`);
                    agent.add(`${answer1}`);
                    agent.add(`${answer2}`);
                    agent.add(`${answer3}`);

                    const quickReplies1 = new Suggestion({
                        title: "Choisissez une réponse",
                        reply: `A`
                    })
                    quickReplies1.addReply_(`B`);
                    quickReplies1.addReply_(`C`);
                    quickReplies1.addReply_(`D`);
                    agent.add(quickReplies1);
                } else {
                    const quickReplies2 = new Suggestion({
                        title: "Choisissez une réponse",
                        reply: `${answer0}`
                    })
                    quickReplies2.addReply_(`${answer1}`);
                    quickReplies2.addReply_(`${answer2}`);
                    quickReplies2.addReply_(`${answer3}`);
                    agent.add(quickReplies2);
                }
            }
        });
    }
    module.exports = questionsRandom;