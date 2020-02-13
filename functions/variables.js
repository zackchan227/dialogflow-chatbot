//Test version

const admin = require('firebase-admin');
exports.admin = admin;


const {Card, Suggestion} = require('dialogflow-fulfillment');
const quickReplies2F = new Suggestion({
    title: "Que-voulez vous faire?",
    reply: "TCF Question"
})
quickReplies2F.addReply_("Outils");
quickReplies2F.addReply_("Divertissement");
quickReplies2F.addReply_("Contacte l'admin");

exports.quickReps = quickReplies2F;

//////////////////////////////////////////////////////////////

const quickRepliesOutils = new Suggestion({
    title: "Choisissez un outil pour vous aider à apprendre le français:",
    reply: "Expressions Idiomatiques"
})
quickRepliesOutils.addReply_("Expressions Communes");
quickRepliesOutils.addReply_("Définition");
quickRepliesOutils.addReply_("Traduction");

exports.quickRepliesOutils = quickRepliesOutils;