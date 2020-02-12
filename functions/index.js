/* eslint-disable promise/catch-or-return */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable promise/always-return */
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';



const functions = require('firebase-functions');
const admin = require('firebase-admin');
//const axios = require('axios');
//const request = require('request-promise');
//const FB = require('fb');
const Facebook = require('facebook-node-sdk');
const request = require('request');
const cheerio = require('cheerio');
const rp = require('request-promise-native');
const align = require('align-text');
const esrever = require('esrever');
//const {google} = require('googleapis');
const projectId = 'mr-fap-naainy';
const {Translate} = require('@google-cloud/translate').v2;
//const welcomeFunction = require('./welcome');
//const projectID = JSON.parse(process.env.FIREBASE_CONFIG).projectId;

const translate = new Translate({projectId});


const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const serviceAccount = require("./mr-fap-naainy-firebase-adminsdk-d55vb-67d7b85f0b.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://mr-fap-naainy.firebaseio.com/`
});

const ref = admin.database().ref(`data`);
var facebook = new Facebook({ appID: '223520468643619', secret: 'nothing' });

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.chatBot = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    function randomInt(min, max) {
        return min + Math.floor((max - min) * Math.random());
    }
    
    //Quick Reply
    const quickRepliesF = new Suggestion({
        title: "Que voulez-vous faire après?",
        reply: "Suivant"
    })
    quickRepliesF.addReply_("Annuler");

    const quickRepliesFF = new Suggestion({
        title: "Que voulez-vous faire après?",
        reply: "Un autre"
    })
    quickRepliesFF.addReply_("Annuler");

    const quickRepliesE = new Suggestion({
        title: "What do you want to do next?",
        reply: "Next"
    })
    quickRepliesE.addReply_("Cancel");

    const quickRepliesV = new Suggestion({
        title: "Muốn xem tiếp chứ?",
        reply: "Triển luôn bạn ei"
    })
    quickRepliesV.addReply_("Đéo");

    //Quick Reply 2
    const quickReplies2F = new Suggestion({
        title: "Que-voulez vous faire?",
        reply: "TCF Question"
    })
    quickReplies2F.addReply_("Contacte l'admin");
    quickReplies2F.addReply_("Mon niveau");
    quickReplies2F.addReply_("Expressions Idiomatiques");
    quickReplies2F.addReply_("Traduction");
    quickReplies2F.addReply_("Définition");
    quickReplies2F.addReply_("Horoscopes");

    const quickReplies2E = new Suggestion({
        title: "There are random question and talk for 4, what's your choice?",
        reply: "Random Question"
    })
    quickReplies2E.addReply_("Talk for 4");

    const quickRepliesTest = new Suggestion({
        title: "There are 3 options, what's your choice?",
        reply: "Random Question"
    })
    quickRepliesTest.addReply_("Talk for 4");
    quickRepliesTest.addReply_("Horoscope");

    const quickReplies2V = new Suggestion({
        title: "Ấn vào nút bên trái để chơi lô đề, ấn vào nút bên phải để xem chân lý",
        reply: "Chơi lô đề"
    })
    quickReplies2V.addReply_("Xem chân lý");

    //Quick Reply 3
    const quickReplies3F = new Suggestion({
        title: "Choisissez une réponse",
        reply: "Quick Reply"
    })
    quickReplies3F.addReply_("Suggestion");

    //Quick Reply 4
    const quickReplies4 = new Suggestion({
        title: "Que voulez-vous faire après?",
        reply: "Rejouer"
    })
    quickReplies4.addReply_("Annuler");

    //Quick Reply 4A
    const quickReplies4A = new Suggestion({
        title: "Voulez-vous améliorer votre niveau?",
        reply: "Questions Aléatoires"
    })
    quickReplies4A.addReply_("Annuler");

    const quickRepliesHoroscopes = new Suggestion({
        title: "Choisissez votre signe",
        reply: "Bélier"
    })
    quickRepliesHoroscopes.addReply_("Taureau");
    quickRepliesHoroscopes.addReply_("Gémeaux");
    quickRepliesHoroscopes.addReply_("Cancer");
    quickRepliesHoroscopes.addReply_("Lion");
    quickRepliesHoroscopes.addReply_("Viergie");
    quickRepliesHoroscopes.addReply_("Balance");
    quickRepliesHoroscopes.addReply_("Scorpion");
    quickRepliesHoroscopes.addReply_("Sagittaire");
    quickRepliesHoroscopes.addReply_("Capricorne");
    quickRepliesHoroscopes.addReply_("Verseau");
    quickRepliesHoroscopes.addReply_("Poissons");

    const quickRepliesHoroscopesChinois = new Suggestion({
        title: "Choisissez votre signe ou donne moi votre année de naissance",
        reply: "🐭"
    })
    quickRepliesHoroscopesChinois.addReply_("🐮");
    quickRepliesHoroscopesChinois.addReply_("🐯");
    quickRepliesHoroscopesChinois.addReply_("🐰");
    quickRepliesHoroscopesChinois.addReply_("🐉");
    quickRepliesHoroscopesChinois.addReply_("🐍");
    quickRepliesHoroscopesChinois.addReply_("🐴");
    quickRepliesHoroscopesChinois.addReply_("🐐");
    quickRepliesHoroscopesChinois.addReply_("🐵");
    quickRepliesHoroscopesChinois.addReply_("🐤");
    quickRepliesHoroscopesChinois.addReply_("🐶");
    quickRepliesHoroscopesChinois.addReply_("🐷");

    // Station de gestion des questions TCF
    function TCFStation(agent) {
        return ref.once(`value`).then((snapshot)=>{
            // Score du joueur
            var score = snapshot.child(`scores/${user_id}`).val();

            // Niveau du joueur
            var niveau;

            // Cette variable vérifie si le joueur a vérifié son niveau
            var testDeNiveau = snapshot.child(`levelTest/${user_id}`).val();

            // Nombre de questions complétées
            var fini = 0;

            // Cette variable vérifie si la question a été posée
            var verQuestion;

            if(score === null || testDeNiveau === 0) {
                if(score === null)
                    admin.database().ref('data/scores').child(`${user_id}`).set(0);
                admin.database().ref('data/levelTest').child(`${user_id}`).set(0);
                for(var i = 0; i< 10; i++){
                    verQuestion = snapshot.child(`AskRandomQ/${user_id}/${i}`).val();
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
                agent.add(quickReplies4A);
        }
    });
    }

    // Générer des questions aléatoires
    function askRandom(agent)
    {   
        return ref.once(`value`).then((snapshot)=>{

            // Nombre de questions (dans la base de données Firebase) 
            // Lorsque vous modifiez le nombre de questions dans la base de données, 
            // modifiez simplement cette variable, pas besoin d'modifiez le code.
            var nombreDeQuestion = 4;

            // Cette variable contient l'ID de la question
            var ID;

            // Score du joueur
            var score = snapshot.child(`scores/${user_id}`).val();

            // Cette variable vérifie si le joueur a vérifié son niveau
            var testDeNiveau = snapshot.child(`levelTest/${user_id}`).val();

            // Cette variable vérifie si la question a été posée
            var verQuestion;

            // Niveau du joueur
            var niveau;

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
                    verQuestion = snapshot.child(`AskRandomQ/${user_id}/${i}`).val();
                    if(verQuestion !== "True") {
                        ID = i;
                        break;     
                    }
                }
                // Lorsque 10 questions sont terminées...
                if(fini === 10) {
                    admin.database().ref('data/levelTest').child(`${user_id}`).set(1);
                    for(j = 0; j< 10; j++)
                        admin.database().ref('data/AskRandomQ').child(`${user_id}/${j}`).set('False');   
                }
            } else {
                // si non
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
                   
                    // Ces 2 fonctions vérifient si le joueur a répondu à toutes les questions 
                    // du questionnaire au niveau du joueur
                    for(i = 0; i < nombreDeQuestion; i++) {
                        lvl = snapshot.child(`TCFNiveauDesQuestions/${niveau}/${i}`).val();
                        if(snapshot.child(`AskRandomQ/${user_id}/${lvl}`).val() === "True")
                        sommeQuestion++; 
                    }

                    if(sommeQuestion === 3)
                        for(j = 0; j < nombreDeQuestion; j++) {
                            lvl = snapshot.child(`TCFNiveauDesQuestions/${niveau}/${j}`).val();
                            if(snapshot.child(`AskRandomQ/${user_id}/${lvl}`).val() === "True")
                                admin.database().ref('data/AskRandomQ').child(`${user_id}/${lvl}`).set('False');
                        }
                    
                    // Question aléatoire
                    IDQuestion = randomInt(0,nombreDeQuestion);
                    lvl = snapshot.child(`TCFNiveauDesQuestions/${niveau}/${IDQuestion}`).val();
                    verQuestion = snapshot.child(`AskRandomQ/${user_id}/${lvl}`).val();
    
                    // Vérifier si la question a été posée
                    while(verQuestion === "True"){
                        IDQuestion = randomInt(0,nombreDeQuestion);
                        lvl = snapshot.child(`TCFNiveauDesQuestions/${niveau}/${IDQuestion}`).val();
                        verQuestion = snapshot.child(`AskRandomQ/${user_id}/${lvl}`).val();
                        // admin.database().ref('data/AskRandomQ').child(`${user_id}/${IDQuestion}`).set('False');
                    }
                    
                    nouvelOuPas = "TCF";
                    ID = snapshot.child(`TCFNiveauDesQuestions/${niveau}/${IDQuestion}`).val();
                }

            // Afficher la question
            admin.database().ref('data/CurrentQuestion').child(`${user_id}`).set(ID);
            var question = snapshot.child(`${nouvelOuPas}questions/${ID}`).val();
            var answer0 = snapshot.child(`${nouvelOuPas}answers/${ID}/0`).val();
            var answer1 = snapshot.child(`${nouvelOuPas}answers/${ID}/1`).val();
            var answer2 = snapshot.child(`${nouvelOuPas}answers/${ID}/2`).val();
            var answer3 = snapshot.child(`${nouvelOuPas}answers/${ID}/3`).val();
            // eslint-disable-next-line promise/always-return
            if(question !== null) {
                agent.add(`[${ID+1}] - ${question}`);

                const quickReplies1 = new Suggestion({
                    title: "Choisissez une réponse",
                    reply: `${answer0}`
                })
                quickReplies1.addReply_(`${answer1}`);
                quickReplies1.addReply_(`${answer2}`);
                quickReplies1.addReply_(`${answer3}`);
        
                agent.add(quickReplies1);

                admin.database().ref('data/AskRandomQ').child(`${user_id}/${ID}`).set('True');
            }
        });
    }

    // Vérification de la bonne réponse de l'utilisateur en 4 réponses
    function checkAnswer(agent)
    {
        return ref.once(`value`).then((snapshot)=>{
            // Cette variable identifie le joueur participant au paquet de questions initiales (questions) 
            // ou au paquet de questions TCF (TCFquestions)
            var nouvelOuPas;

            // Cette variable vérifie si le joueur a vérifié son niveau
            var testDeNiveau = snapshot.child(`levelTest/${user_id}`).val();
            if(testDeNiveau === 0)
                nouvelOuPas="";
            else
                nouvelOuPas="TCF";

            // Réponse du joueur
            var ans = agent.parameters['answer'];

            // Question actuelle est posée
            var currentQuestion = snapshot.child(`CurrentQuestion/${user_id}`).val();

            // La bonne réponse à la question
            var correctA = snapshot.child(`${nouvelOuPas}corrects/${currentQuestion}`).val();

            // Explication de la bonne réponse
            var explication = snapshot.child(`${nouvelOuPas}notes/${currentQuestion}`).val();

            // Score du joueur
            var score;

            // Niveau du joueur
            var niveau;

            // Cette variable vérifie si la réponse du joueur est bonne ou fausse
            var check = false;

            // Vérifie si la réponse du joueur est bonne ou fausse
            if(ans === correctA) {
                check = true;
            }

            // Calculer le score du joueur
            if(ans === 'je ne sais pas' || ans === 'Je ne sais pas'){
                agent.add(`Essayez d'y répondre, ne vous inquiétez pas de l'échec 🤗`);
            }
            else if(check === true){
                agent.add(`⭕ C'est Correct :D`);    
                agent.add(`${explication}`);
                score = snapshot.child(`scores/${user_id}`).val();
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
                admin.database().ref('data/scores').child(`${user_id}`).set(score);
            }
            //eslint-disable-next-line promise/always-return
            else if(check !== true && explication !== null){ 
                agent.add(`❌ Ce n'est pas correct :(`);              
                agent.add(`La bonne réponse est: "${correctA}"`);    
                agent.add(`Explication: ${explication}`);
                score = snapshot.child(`scores/${user_id}`).val();
                if(testDeNiveau === 2)
                    score -= 25;
                admin.database().ref('data/scores').child(`${user_id}`).set(score);                                                                                        
            }       
            else {
                agent.add(`Pardon, il y a une erreur, réessayez!`);   
            }

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
                admin.database().ref('data/AskRandomQ').child(`${user_id}/9`).set('False');   
                admin.database().ref('data/levelTest').child(`${user_id}`).set(2);
                agent.add(quickRepliesFinish);
            }
            else
                agent.add(quickReplies4);
        });       
    }

    function contactNous(agent) {
        const { question } = agent.parameters;
        var position;
        var i;
        return admin.database().ref('contactez-Nous').once(`value`).then((snapshot)=>{
            for(i = 0; i < 100; i++)
                if(snapshot.child(`${user_id}/${i}`).val() === null) {
                    position = i;
                    break;
                }
            admin.database().ref('contactez-Nous').child(`${user_id}/${position}/Question`).set(question); 
            agent.add(`Votre question a été envoyée. Nous répondrons à votre question dans les plus brefs délais. N'oubliez pas votre numéro de question pour voir notre réponse.`);
            agent.add(`Votre numero de question: ${position}`);
            const quickRepliesQuestionU = new Suggestion({
                title: `Que voulez-vous faire ensuite?`,
                reply: "Nouvelle question"
            });
            quickRepliesQuestionU.addReply_("Annuler");
            agent.add(quickRepliesQuestionU); 
        });    
    }

    function contactezNousStation(agent){
        var responsePret = false;
        var nombre=0;
        var j;
        var quickRepliesQStation;
        return admin.database().ref('contactez-Nous').once(`value`).then((snapshot)=>{
            agent.add("C'est votre station Q&R où vous pouvez demander à notre mentor votre problème.")
            for(j = 0; j < 100; j++)
                if(snapshot.child(`${user_id}/${j}/R`).val() !== null) {
                    responsePret = true;
                    nombre++;
                }
            if(responsePret === true) {
                quickRepliesQStation = new Suggestion({
                    title: `Il y a "${nombre}" de vos questions auxquelles nous avons répondu`,
                    reply: "Nouvelle question"
                });
                quickRepliesQStation.addReply_("Mes questions");
                quickRepliesQStation.addReply_("Annuler");
            }
            else {
                quickRepliesQStation = new Suggestion({
                    title: `Nous n'avons répondu à aucune de vos questions. Voulez-vous poser une question?`,
                    reply: "Nouvelle question"
                });
                quickRepliesQStation.addReply_("Annuler");
            }
            agent.add(quickRepliesQStation);
        }); 
    }

    function questionStation(agent) {
        var responsePret=false;
        var i,j;
        return admin.database().ref('contactez-Nous').once(`value`).then((snapshot)=>{
            for(j = 0; j < 100; j++)
                if(snapshot.child(`${user_id}/${j}/R`).val() !== null) {
                    responsePret = true;
                    break;
                }
            
            if(responsePret === true) {
                const quickRepliesQuestionU = new Suggestion({
                    title: `Donnez-nous le numéro de votre question!`,
                    reply: "0"
                })
                for(i = 1; i < 100; i++)
                    if(snapshot.child(`${user_id}/${i}/R`).val() !== null) 
                        quickRepliesQuestionU.addReply_(`${i}`);
                agent.add(quickRepliesQuestionU);
            } else {
                const quickRepliesQuestionU = new Suggestion({
                    title: `Désolé, vous n'avez aucune réponse de notre part`,
                    reply: "Nouvelle question"
                });
                quickRepliesQuestionU.addReply_("Annuler");
                agent.add(quickRepliesQuestionU);
            }
        });   
    }

    function regarderResponses(agent) {
        const { numero } = agent.parameters;
        return admin.database().ref('contactez-Nous').once(`value`).then((snapshot)=>{
            var question = snapshot.child(`${user_id}/${numero}/Question`).val();
            var réponse = snapshot.child(`${user_id}/${numero}/R`).val();
            agent.add(`[${numero}] Votre question: ${question}`);
            agent.add(`Notre réponse: ${réponse}`);
            var remove = admin.database().ref(`contactez-Nous/${user_id}/${numero}`)
            // eslint-disable-next-line promise/no-nesting
            remove.remove()
            .then(function() {
                console.log("Remove succeeded.")
            })
            .catch(function(error) {
                console.log("Remove failed: " + error.message)
            });
            const quickRepliesQuestionU = new Suggestion({
                title: `Que voulez-vous faire ensuite?`,
                reply: "Nouvelle question"
            });
            quickRepliesQuestionU.addReply_("Autres Réponses");
            quickRepliesQuestionU.addReply_("Annuler");
            agent.add(quickRepliesQuestionU);
        });
    }

    // Checking the incorrect answer of user in 4 answers
    function checkFallback(agent) {
        return ref.once(`value`).then((snapshot)=>{
            var ran = randomInt(0,4);
            var a0 = snapshot.child(`answers/${id}/0`).val();
            var a1 = snapshot.child(`answers/${id}/1`).val();
            var a2 = snapshot.child(`answers/${id}/2`).val();
            var a3 = snapshot.child(`answers/${id}/3`).val();
            var text1 = `Quelle est votre bonne réponse ?`;
            var text2 = `Votre réponse est ?`;
            var text3 = `Choisissez une réponse ci-dessous`;
            var text4 = `Choisissez la bonne réponse, s'il vous plaît`;
            // eslint-disable-next-line promise/always-return
            switch(ran)
            {
                case 0: agent.add(text1);
                        break;
                case 1: agent.add(text2);
                        break;
                case 2: agent.add(text3);
                        break;
                case 3: agent.add(text4);
                        break; 
            }
            const quickReplies5 = new Suggestion({
                title: "Choisissez une réponse",
                reply: `${a0}`
            })
            quickReplies5.addReply_(`${a1}`);
            quickReplies5.addReply_(`${a2}`);
            quickReplies5.addReply_(`${a3}`);

            agent.add(quickReplies5);
        });
    }

    // Function is made 4 for
    function talk4For(agent)
    {
        return ref.child("idioms").once("value", function(snapshot) {
            var max = snapshot.numChildren();
            var ran = randomInt(0,max);
            var idiom =  snapshot.child(`${ran}`).val();
            if(idiom !== null){
                agent.add(`[${ran+1}] `+ idiom);
            }
            else agent.add('Il y a une erreur, réessayez svp');
            agent.add(quickRepliesF);
          })
    }

    // Function is made for 4
    function talkFor4(agent){
        return ref.child("expressions").once("value", function(snapshot) {
            var max = snapshot.numChildren();
            var ran = randomInt(0,max);     
            var express =  snapshot.child(`${ran}/express`).val();
            var maxEx =  snapshot.child(`${ran}/example`).numChildren();
            var ranEx = randomInt(0,maxEx);
            var example = snapshot.child(`${ran}/example/${ranEx}`).val();
            if(express !== null && example !== null){
                agent.add(`[L'expression ${ran+1}] `+ express);
                agent.add(`[L'exemple ${ranEx+1}] `+ example);
            }
            else agent.add('Il y a une erreur, réessayez svp');
            agent.add(quickRepliesFF);
          })
    }

    // Translate function from any languages to another (Available in 4 languages)
    async function translateText(agent) {       
        var text = agent.parameters['any']; // The text to translate
        var lang = agent.parameters['language']; // The target language
        var iso; // The target language's iso code
       
        switch(lang)
        {
            case 'Anglais':
            case 'English':
            case 'english':
            case 'tiếng anh':
            case 'tiếng end':
            case 'tiếng Mỹ':
            case 'tiếng mỹ':
            case 'endrjsk':
            case 'engrisk':
            case 'Tiếng Anh':
            case '英语':
            case '英文':
                iso = 'en';
                break;
            case 'Française':
            case 'Français':
            case 'Francaise':
            case 'Francais':
            case 'French':
            case 'tiếng pháp':
            case 'Tiếng Pháp':
            case 'Tiếng FAP':
            case 'tiếng fap':
            case 'fap':
            case '法语':
            case '法文':
                iso = 'fr';
                break;
            case 'Vietnamien':
            case 'Vietnamese':
            case 'vietnamese':
            case 'vietnamien':
            case 'Tiếng Việt':
            case 'tiếng việt':
            case 'tiếng vịt':
            case 'tiếng Vịt':
            case 'Tiếng Vịt':
            case 'vịt':
            case '越南语':
            case '越南文':
                iso = 'vi';
                break;
            case 'Chinois':
            case 'Chinese':
            case 'Tiếng Trung':
            case 'Tiếng Tàu':
            case 'Tiếng Hoa':
            case 'tiếng trung quốc':
            case 'trung quốc':
            case 'trung':
            case 'tiếng tàu':
            case '中文':
            case '华语':
                iso = 'zh';
                break;
            default:
                iso = 'null';
                agent.add(`Pardon, la langue ${lang} n'est pas encore supporté.`);
                agent.add(quickReplies2F);
                return;
        }
     
        const [translation] = await translate.translate(text, iso);
        agent.add(`${text} en ${lang}: ${translation}`);
        agent.add(quickReplies2F);
      }

    // Obtenir l'identifiant utilisateur facebook
    // Cette variable doit être globale
    var user_id = agent.originalRequest.payload.data.sender.id;

    // Default welcome when start to the conversation
    function welcome(agent) {
        var greeting = agent.parameters['yo'];
        var lang;
        // Appel au graphique Facebook pour obtenir les informations des utilisateurs
        var url = `https://graph.facebook.com/${user_id}?fields=name&access_token=EAADLSmoiLyMBAHjhTE5QbiZAoGcVCcJEq1fmBTSlzYS98nMWA7utAuZAcSmZA5UiheZCpkHpRoT7LhnVPWu4LZAa7YyDSnlN8FZBH7dVnoKIPgTZBJ3P3HBNiBsKfeEvQIRJhK8ugxfFTMHCAaveSXKanpd8IDu7yy6M06U27ybJAZDZD`;
        
        var options = {
        uri: url,
        json: true
        };

        translate.detect(greeting, (err, results) => {
            if (!err) {
            lang = results.language;
            }
        });

        return rp.get( options )
        // eslint-disable-next-line promise/always-return
        .then( body => {
            if(greeting === 'yo' || greeting === 'Yo'){
                agent.add(`Yo, what's up ${body.name}‼️ Long time no see, how are you bro?`);
                agent.add(quickRepliesTest);
            }
            else{
                switch(lang)
                {
                    case 'en':
                        agent.add(`Hello ${body.name}‼️`);
                        agent.add(quickReplies2E);
                        break;
                    case 'fr':
                        agent.add(`Bonjour ${body.name}‼️`);
                        agent.add(quickReplies2F);
                        break;
                    case 'vi':
                        agent.add(`Sin trào ${body.name}‼️`);
                        agent.add(quickReplies2V);
                        break;
                }
            }
            // eslint-disable-next-line promise/no-nesting
            return admin.database().ref(`data`).once(`value`).then((snapshot)=>{
                var valeur;
                var position;
                var deja = false;
                for(var i = 0; i< 1000; i++) {
                    valeur = snapshot.child(`userID/${i}`).val();
                    // eslint-disable-next-line promise/always-return
                    if(valeur === null) {
                        position = i;
                        break;
                    }
                }
                for(var j = 0; j < position; j++) {
                    valeur = snapshot.child(`userID/${j}`).val();
                    if(valeur === user_id) {
                        deja = true;
                        break;
                    }
                }
                if(deja === false) {
                    admin.database().ref('data/userID').child(`${position}`).set(user_id);
                }
            });
        });
    }

    // Default fallback when the chatbot did not understand
    function fallback(agent) {
        agent.add(`Je n'ai pas compris`);
        agent.add(`Je suis désolé, pouvez-vous réessayer?`);
        // agent.add(`I didn't understand`);
        // agent.add(`I'm sorry, can you try again?`);
    }
    
    function contentHoroscopes(agent){
        agent.add(quickRepliesHoroscopes);
    }
    // eslint-disable-next-line consistent-return
    // 
    function horoscopes(agent){
        var sign = agent.parameters['horoscope'];
        var horos = ['Bélier', 'Taureau', 'Gémeaux','Cancer','Lion', 'Viegre', 'Balance', 'Scorpion','Sagittaire', 'Capricorne','Verseau','Poissons'];
        var check = false;
        var index;
        for(var i = 0; i < 12; i++){
            if(sign === horos[i]){
                check = true;
                index = i+1;
                break;
            }
        }

        if(check !== true){
            agent.add(`Horoscope ${sign} n'est pas disponible`);
            agent.add(quickRepliesTest);
            return;
        }

        if(check === true){
            const URL = `https://www.horoscope.com/fr/horoscopes/general/horoscope-general-du-jour-aujourdhui.aspx?signe=${index}`; // Crawl data from URL
            const getPageContent = (uri) => {
                const options = {
                    uri,
                    headers: {
                    'User-Agent': 'Request-Promise'
                    },
                    transform: (body) => {
                    return cheerio.load(body) // Parsing the html code
                    }
                }
            
                return rp(options) // return Promise
            }

            
            // eslint-disable-next-line promise/catch-or-return
            // eslint-disable-next-line consistent-return
            return getPageContent(`${URL}`).then($ => {
                //console.log($('div.view-content > ul').text())
                var text = $('div.horoscope-content > p').text();
                var text1 = '';
                for(var i = 0; i < 1696; i++){
                    
                    if(i > 200 && text[i] === '\n'){
                        break;
                    }
                    text1 += text[i];
                }
                agent.add(`Horoscopes ${sign}: `);
                agent.add(text1);
                agent.add(quickReplies2F);
            })
        }
    }

    function contentHoroscopesChinois(agent){
        agent.add(quickRepliesHoroscopesChinois);
    }
    // eslint-disable-next-line consistent-return
    // 
    function horoscopesChinois(agent){
        var sign = agent.parameters['HoroscopesChina'];
        var horos = ['🐭', '🐮', '🐯','🐰','🐉', '🐍', '🐴', '🐐','🐵', '🐤','🐶','🐷'];
        var check = false;
        var index;

        if(isNaN(sign)){
            for(var i = 0; i < 12; i++){
                if(sign === horos[i]){
                    check = true;
                    switch(sign){
                        case '🐵': 
                            index = 9;
                            sign = 'Singe';
                            break;
                        case '🐤':
                            index = 10;
                            sign = 'Coq';
                            break;
                        case '🐶':
                            index = 11;
                            sign ='Chien';
                            break;
                         case '🐷':
                            index = 12;
                            sign ='Cochon';
                            break;
                         case '🐭':
                            index = 3;
                            sign ='Rat';
                            break;
                         case '🐮':
                            index = 1;
                            sign ='Boeuf';
                            break;
                         case '🐯':
                            index = 6;
                            sign ='Tigre';
                            break;
                         case '🐰':
                            index = 7;
                            sign ='Lièvre';
                            break;
                         case '🐉':
                            index = 5;
                            sign ='Dragon';
                            break;
                         case '🐍':
                            index = 4;
                            sign ='Serpent';
                            break;
                         case '🐴':
                            index = 8;
                            sign ='Cheval';
                            break;
                         case '🐐':
                            index = 2;
                            sign ='Chèvre';
                            break;
                    }
                    //index = i+1;
                    break;
                }
            }
        }
        else {
            check = true;
            var mod = sign % 12;
            switch(mod){
                case 0: 
                    index = 9;
                    sign = 'Singe';
                    break;
                case 1:
                    index = 10;
                    sign = 'Coq';
                    break;
                case 2:
                    index = 11;
                    sign ='Chien';
                    break;
                 case 3:
                    index = 12;
                    sign ='Cochon';
                    break;
                 case 4:
                    index = 3;
                    sign ='Rat';
                    break;
                 case 5:
                    index = 1;
                    sign ='Boeuf';
                    break;
                 case 6:
                    index = 6;
                    sign ='Tigre';
                    break;
                 case 7:
                    index = 7;
                    sign ='Lièvre';
                    break;
                 case 8:
                    index = 5;
                    sign ='Dragon';
                    break;
                 case 9:
                    index = 4;
                    sign ='Serpent';
                    break;
                 case 10:
                    index = 8;
                    sign ='Cheval';
                    break;
                 case 11:
                    index = 2;
                    sign ='Chèvre';
                    break;
            }
        }

        if(check !== true){
            agent.add(`Horoscope ${sign} n'est pas disponible`);
            agent.add(quickRepliesTest);
            return;
        }

        if(check === true){
            const URL = `https://www.horoscope.com/fr/horoscopes/chinois/horoscope-chinois-du-jour-aujourdhui.aspx?signe=${index}`; // Crawl data from URL
            const getPageContent = (uri) => {
                const options = {
                    uri,
                    headers: {
                    'User-Agent': 'Request-Promise'
                    },
                    transform: (body) => {
                    return cheerio.load(body) // Parsing the html code
                    }
                }
            
                return rp(options) // return Promise
            }

            
            // eslint-disable-next-line promise/catch-or-return
            // eslint-disable-next-line consistent-return
            return getPageContent(`${URL}`).then($ => {
                //console.log($('div.view-content > ul').text())
                var text = $('div.horoscope-content > p').text();
                var text1 = '';
                for(var i = 0; i < 1696; i++){
                    
                    if(i > 200 && text[i] === '\n'){
                        break;
                    }
                    text1 += text[i];
                }
                agent.add(`Horoscopes ${sign}: `);
                agent.add(text1);
                agent.add(quickReplies2F);
            })
        }
    }

    function contentTarots(agent){
        //agent.add(quickRepliesHoroscopes);
    }
    // eslint-disable-next-line consistent-return
    // 
    // eslint-disable-next-line consistent-return
    function tarots(agent){
        //var sign = agent.parameters['horoscope'];
        var check = false;
        var index = randomInt(0,22) + 1;
        if(index > 0 && index < 23)
        {
            check = true;
        }
        // var horos = ['Bélier', 'Taureau', 'Gémeaux','Cancer','Lion', 'Viegre', 'Balance', 'Scorpion','Sagittaire', 'Capricorne','Verseau','Poissons'];
        // var check = false;
        // var index;
        // for(var i = 0; i < 12; i++){
        //     if(sign === horos[i]){
        //         check = true;
        //         index = i+1;
        //         break;
        //     }
        // }

        if(check !== true){
            agent.add(`Il y a une erreur!`);
            //agent.add(quickRepliesTest);
            return;
        }

        if(check === true){
            const URL = `https://www.horoscope.com/fr/tarot/signification-de-la-carte-du-tarot.aspx?TarotCardSelectorID_numericalint=${index}`; // Crawl data from URL
            const getPageContent = (uri) => {
                const options = {
                    uri,
                    headers: {
                    'User-Agent': 'Request-Promise'
                    },
                    transform: (body) => {
                    return cheerio.load(body) // Parsing the html code
                    }
                }
            
                return rp(options) // return Promise
            }

            
            // eslint-disable-next-line promise/catch-or-return
            // eslint-disable-next-line consistent-return
            return getPageContent(`${URL}`).then($ => {
                var text = $('div.span-9.span-xs-12.col').text();
                var text1 = '';
                for(var i = 0; i < 1696; i++){
                    
                    if(i > 200 && text[i] === '\n'){
                        break;
                    }
                    text1 += text[i];
                }
                agent.add(`${text1}`);
                //agent.add(quickReplies2F);
            })
        }
    }

    function defineWord(agent){
        var word = agent.parameters['word'];
        //var ran = Math.floor((10) * Math.random());
        // var options = {
        //     method: 'GET',
        //     url: 'https://mashape-community-urban-dictionary.p.rapidapi.com/define',
        //     qs: {term: `${word}`},
        //     headers: {
        //     'x-rapidapi-host': 'mashape-community-urban-dictionary.p.rapidapi.com',
        //     'x-rapidapi-key': '150ec41dbcmsh0524350c3406a72p1fc807jsnbd8c05b29ec9'
        //     }
        // };
        
        // // eslint-disable-next-line prefer-arrow-callback
        // return rp(options, function (error, response, body) {
        //     const def = JSON.parse(body);
        //     //console.log(def.list[ran].definition);
        //     agent.add(`${def.list[ran].definition}`);
        // });
        const URL = `https://www.le-dictionnaire.com/definition/${word}`; // Crawl data from URL
        const getPageContent = (uri) => {
            const options = {
                uri,
                headers: {
                'User-Agent': 'Request-Promise'
                },
                transform: (body) => {
                return cheerio.load(body) // Parsing the html code
                }
             }
            
            return rp(options) // return Promise
        }

            
        // eslint-disable-next-line promise/catch-or-return
        // eslint-disable-next-line consistent-return
        return getPageContent(`${URL}`).then($ => {
            //console.log($('div.view-content > ul').text())
            var text = $('div.defbox > ul').text();
            var mot = $('div.defbox > span').text();
            agent.add(`Définition ${word}: `);
            // eslint-disable-next-line prefer-arrow-callback
            agent.add(align(text, function (len, max, line, lines) {
                return {
                    indent: Math.floor((max - len) / 2), 
                    character: '-', 
                    prefix: ' 👍 '
                };
            }));
            agent.add(quickReplies2F);
        })
    }

    function regarderNiveau(agent){
        var valeur;
        var niveau;
        var score = ['','','','',''];
        var temp,temp1;
        var finalScore ='';
        var count = 0;
        return ref.once(`value`).then((snapshot)=>{
            valeur = snapshot.child(`scores/${user_id}`).val(); 
            temp = valeur;
            temp1 = temp;
            while(temp >= 1){   
                temp = Math.floor(temp) / 10;
                //console.log(temp);               
                count++;
                //console.log(count);
            }
            
            for(var i = count-1; i > 0; i--){
                var temp_unit = Math.floor(temp1) % 10;
                switch(temp_unit){
                    case 0:
                        score[i] += '0️⃣';
                        break;
                    case 1:
                        score[i] += '1️⃣';
                        break;
                    case 2:
                        score[i] += '2️⃣';
                        break;
                    case 3:
                        score[i] += '3️⃣';
                        break;
                    case 4:
                        score[i] += '4️⃣';
                        break;
                    case 5:
                        score[i] += '5️⃣';
                        break;
                    case 6:
                        score[i] += '6️⃣';
                        break;
                    case 7:
                        score[i] += '7️⃣';
                        break;
                    case 8:
                        score[i] += '8️⃣';
                        break;
                    case 9:
                        score[i] += '9️⃣';
                        break;
                }
                temp1 /= 10;
                if(temp1 < 10){
                    temp1 = Math.floor(temp1) %10;
                    switch(temp1){
                        case 0:
                            score[0] += '0️⃣';
                            break;
                        case 1:
                            score[0] += '1️⃣';
                            break;
                        case 2:
                            score[0] += '2️⃣';
                            break;
                        case 3:
                            score[0] += '3️⃣';
                            break;
                        case 4:
                            score[0] += '4️⃣';
                            break;
                        case 5:
                            score[0] += '5️⃣';
                            break;
                        case 6:
                            score[0] += '6️⃣';
                            break;
                        case 7:
                            score[0] += '7️⃣';
                            break;
                        case 8:
                            score[0] += '8️⃣';
                            break;
                        case 9:
                            score[0] += '9️⃣';
                            break;
                    }
                }
                
            }
            finalScore = score[0] + score[1] + score[2] + score[3] + score[4];

            if(valeur < 0){
                niveau = "✡️";
                finalScore = `❗❓❗❓❗`;
            }

            if(valeur >0 && valeur < 500)
                niveau = "🇦1️⃣";

            if(valeur >= 500 && valeur < 1000)
                niveau = "🇦2️⃣";

            if(valeur >=1000 && valeur < 1500)
                niveau = "🇧1️⃣";

            if(valeur >=1500 && valeur < 2000)
                niveau = "🇧2️⃣";

            if(valeur >=2000 && valeur < 2500)
                niveau = "🇨1️⃣";

            if(valeur >=2500 && valeur <= 3000)
                niveau = "🇨2️⃣";

            if(valeur >= 6969){
                niveau = "Vô ∞ Cực";
            }
            
            agent.add(`Votre niveau: ${niveau}`);
            agent.add(`Votre score: ${finalScore}`);
            agent.add(quickReplies4A);
        });
    }

   
    // // Uncomment and edit to make your own intent handler
    // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    // Just testing
    function test(agent) {
        agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
        agent.add(new Card({
            title: `Title: this is a card title`,
            imageUrl: 'https://drive.google.com/file/d/1OKRA4s4HhgfZqVG8C1Q7VPB3Z3_FClHm/view',
            text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
            buttonText: 'This is a button',
            buttonUrl: 'https://assistant.google.com/'
        })
        );
        agent.add(quickReplies3F);
        //agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
    }

    // // Uncomment and edit to make your own Google Assistant intent handler
    // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    // function googleAssistantHandler(agent) {
    //   let conv = agent.conv(); // Get Actions on Google library conv instance
    //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
    //   agent.add(conv); // Add Actions on Google library responses to your agent's response
    // }
    // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
    // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    // intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('Test', test);
    intentMap.set('Random', askRandom);
    intentMap.set('Answers', checkAnswer);
    intentMap.set('AnswersFallback', checkFallback);
    intentMap.set('Idioms', talk4For);
    intentMap.set('Expressions', talkFor4);
    intentMap.set('Translate', translateText);
    intentMap.set('Horoscopes', contentHoroscopes);
    intentMap.set('Horoscopes - custom', horoscopes);
    intentMap.set('Horoscopes China', contentHoroscopesChinois);
    intentMap.set('Horoscopes China - custom', horoscopesChinois);
    intentMap.set('Tarots', tarots);
    //intentMap.set('Tarot - custom', tarots);
    intentMap.set('Definition', defineWord);
    intentMap.set('Resultat', regarderNiveau);
    intentMap.set('TCFNotification', TCFStation);
    intentMap.set('contactezNousStation', contactezNousStation);
    intentMap.set('contactNous', contactNous);
    intentMap.set('utilisateurquestionStation', questionStation);
    intentMap.set('regarderResponses', regarderResponses);
    agent.handleRequest(intentMap);
});

