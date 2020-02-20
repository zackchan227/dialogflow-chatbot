const variables = require('../variables');
const index = require('../index');

function adminPoserQStation (agent){
    agent.add(`N'interrompez pas l'application lorsque vous ajoutez une question.`);
    agent.add('Quel est le niveau de votre question?');
}
module.exports = adminPoserQStation;