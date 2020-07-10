//Test version
const projectId = 'mr-fap-naainy';
const {Translate} = require('@google-cloud/translate').v2;
const index = require('./index');

const rp = require('request-promise-native');
exports.rp =rp;

const cheerio = require('cheerio');
exports.cheerio = cheerio;

const admin = require('firebase-admin');
exports.admin = admin;

const translate = new Translate({projectId});
exports.translate = translate;


const serviceAccount = require("./mr-fap-naainy-firebase-adminsdk-d55vb-67d7b85f0b.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://mr-fap-naainy.firebaseio.com/`
});


const ref = admin.database().ref(`data`);
exports.ref = ref;

const {Card, Suggestion} = require('dialogflow-fulfillment');

//////////////////////////////////////////////////////////////
const quickRepliesOutils = new Suggestion({
    title: "Choisissez un outil pour vous aider à apprendre le français:",
    reply: "Idiomes"
})
quickRepliesOutils.addReply_("Expressions Communes");
quickRepliesOutils.addReply_("Définition");
quickRepliesOutils.addReply_("Traduction");
exports.quickRepliesOutils = quickRepliesOutils;

////////////////////////////////////////////////////////////////
//Quick Reply
const quickRepliesIdiomes = new Suggestion({
    title: "Que voulez-vous faire après?",
    reply: "Suivant"
})
quickRepliesIdiomes.addReply_("Annuler");
exports.quickRepliesIdiomes = quickRepliesIdiomes;

///////////////////////////////////////////////////////////////
const quickReplieseCommunes = new Suggestion({
    title: "Que voulez-vous faire après?",
    reply: "Un autre"
})
quickReplieseCommunes.addReply_("Annuler");
exports.quickReplieseCommunes = quickReplieseCommunes;

/////////////////////////////////////////////////////////
const quickReplies2F = new Suggestion({
    title: "Que-voulez vous faire?",
    reply: "TCF Question"
})
quickReplies2F.addReply_("Outils");
quickReplies2F.addReply_("Divertissement");
quickReplies2F.addReply_("Contacte mentor");
quickReplies2F.addReply_("Contacte l'admin");
exports.quickReplies2F = quickReplies2F;

const quickReplies2E = new Suggestion({
    title: "Welcome to Chatbot `Parlez-vous Francais`, an effective tool for learning French! Currently English language is not yet supported!",
    reply: "TCF Questions"
})
quickReplies2E.addReply_("Annuler");
exports.quickReplies2E = quickReplies2E;

const quickReplies2V = new Suggestion({
    title: "Chào mừng bạn đến với Chatbot `Parlez-vous Francais`, một công cụ hữu hiệu để học tiếng Pháp ! Hiện tại ngôn ngữ tiếng Việt vẫn chưa được hỗ trợ !",
    reply: "TCF Questions"
})
quickReplies2V.addReply_("Annuler");
exports.quickReplies2V = quickReplies2V;

/////////////////////////////////////////////////////
//Quick Reply 4A
const quickRepliesNiveau = new Suggestion({
    title: "Voulez-vous améliorer votre niveau?",
    reply: "Questions Aléatoires"
})
quickRepliesNiveau.addReply_("Annuler");
exports.quickRepliesNiveau = quickRepliesNiveau;

//////////////////////////////////////////////////////
//Quick Reply 4
const quickRepliesQChange = new Suggestion({
    title: "Que voulez-vous faire après?",
    reply: "Rejouer"
})
quickRepliesQChange.addReply_("Annuler");
exports.quickRepliesQChange = quickRepliesQChange;

/////////////////////////////////////////////////////
//Quick Reply 4A
const quickRepliesQCommencer = new Suggestion({
    title: "Voulez-vous améliorer votre niveau?",
    reply: "Questions Aléatoires"
})
quickRepliesQCommencer.addReply_("Annuler");
exports.quickRepliesQCommencer = quickRepliesQCommencer;

/////////////////////////////////////////////////////
//Quick Reply Definition
const quickRepliesDefinition = new Suggestion({
    title: "Il y a trois fonctions pour votre choix :",
    reply: "Définir un mot"
})
quickRepliesDefinition.addReply_("Synonymes");
quickRepliesDefinition.addReply_("Antonymes");
quickRepliesDefinition.addReply_("Annuler");
exports.quickRepliesDefinition = quickRepliesDefinition;

////////////////////////////////////////////////////////
const quickRepliesAdmin = new Suggestion({
    title: "Vous êtes administrateur.",
    reply: "Poser une question"
})
quickRepliesAdmin.addReply_("Répondre aux questions");
quickRepliesAdmin.addReply_("Annuler");
exports.quickRepliesAdmin = quickRepliesAdmin;

////////////////////////////////////////////////////////
const quickRepliesPasAdmin = new Suggestion({
    title: "Désolé, cette fonction est réservée aux administrateurs",
    reply: "Annuler"
})
exports.quickRepliesPasAdmin = quickRepliesPasAdmin;

////////////////////////////////////////////////////////
const quickRepliesDivertissement = new Suggestion({
    title: "Vous pouvez vous référer aux horoscopes, aux horoscopes chinois et au tarot pour prédire votre destin aujourd'hui.",
    reply: "Horoscopes"
})
quickRepliesDivertissement.addReply_("Horoscopes Chinois");
exports.quickRepliesDivertissement = quickRepliesDivertissement;

////////////////////////////////////////////////////////
const quickRepliesTest = new Suggestion({
    title: "Désolé, le zodiaque que vous avez choisi n'existe pas! Veuillez réessayer.",
    reply: "Horoscopes"
})
quickRepliesTest.addReply_("Horoscopes Chinois");
exports.quickRepliesTest = quickRepliesTest;
