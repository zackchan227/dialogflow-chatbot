const variables = require('../variables');

function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
}

// Function is made 4 for
function idiomes(agent)
{
    return variables.ref.child("idioms").once("value", function(snapshot) {
        var max = snapshot.numChildren();
        var ran = randomInt(0,max);
        var idiom =  snapshot.child(`${ran}`).val();
        if(idiom !== null){
            agent.add(`[${ran+1}] `+ idiom);
        }
        else agent.add('Il y a une erreur, réessayez svp');
        agent.add(variables.quickRepliesIdiomes);
      })
}

module.exports = idiomes;