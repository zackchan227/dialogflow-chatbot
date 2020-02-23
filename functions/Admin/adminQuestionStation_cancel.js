const variables = require('../variables');
const index = require('../index');

function adminQuestionStation_cancel (agent){
    agent.add(variables.quickReplies2F);
} 
module.exports = adminQuestionStation_cancel;