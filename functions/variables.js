//Test version
const projectId = 'mr-fap-naainy';
const {Translate} = require('@google-cloud/translate').v2;

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

//////////////////////////////////////////////////////////////
const quickRepliesTest = new Suggestion({
    title: "There are 3 options, what's your choice?",
    reply: "Random Question"
})
quickRepliesTest.addReply_("Talk for 4");
quickRepliesTest.addReply_("Horoscope");
exports.quickRepliesTest = quickRepliesTest;

/////////////////////////////////////////////////////////
const quickReplies2F = new Suggestion({
    title: "Que-voulez vous faire?",
    reply: "TCF Question"
})
quickReplies2F.addReply_("Outils");
quickReplies2F.addReply_("Divertissement");
quickReplies2F.addReply_("Contacte l'admin");
exports.quickReplies2F = quickReplies2F;

const quickReplies2E = new Suggestion({
    title: "There are random question and talk for 4, what's your choice?",
    reply: "Random Question"
})
quickReplies2E.addReply_("Talk for 4");
exports.quickReplies2E = quickReplies2E;

const quickReplies2V = new Suggestion({
    title: "Ấn vào nút bên trái để chơi lô đề, ấn vào nút bên phải để xem chân lý",
    reply: "Chơi lô đề"
})
quickReplies2V.addReply_("Xem chân lý");
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
