const variables = require('../variables');
const index = require('../index');

function adminStation (agent){
    var admin=false;
    switch(index.user_id){
        case "3476831299025251":
            admin = true;
            break;
        case "2971350629562642":
            admin = true;
            break;
        default:
            admin = false;
            break;
    }
    if(admin === true)
        agent.add(variables.quickRepliesAdmin);
    else
        agent.add(variables.quickRepliesPasAdmin);
}
module.exports = adminStation;