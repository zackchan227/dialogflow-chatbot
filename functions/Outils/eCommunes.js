const variables = require('../variables');

function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
}

// Function is made for 4
function eCommunes(agent){
    return variables.ref.child("expressions").once("value", function(snapshot) {
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
        agent.add(variables.quickReplieseCommunes);
      })
}

module.exports = eCommunes;