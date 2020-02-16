const variables = require('./variables');
const index = require('./index');


  // Default welcome when start to the conversation
  function welcome(agent) {
   var greeting = agent.parameters['yo'];
   var lang;
   // Appel au graphique Facebook pour obtenir les informations des utilisateurs
   var url = `https://graph.facebook.com/${index.user_id}?fields=name&access_token=EAADLSmoiLyMBAHjhTE5QbiZAoGcVCcJEq1fmBTSlzYS98nMWA7utAuZAcSmZA5UiheZCpkHpRoT7LhnVPWu4LZAa7YyDSnlN8FZBH7dVnoKIPgTZBJ3P3HBNiBsKfeEvQIRJhK8ugxfFTMHCAaveSXKanpd8IDu7yy6M06U27ybJAZDZD`;
   
   var options = {
    uri: url,
    json: true
   };

   variables.translate.detect(greeting, (err, results) => {
       if (!err) {
       lang = results.language;
       }
   });

   return variables.rp.get( options )
   // eslint-disable-next-line promise/always-return
   .then( body => {
       if(greeting === 'yo' || greeting === 'Yo'){
           agent.add(`Yo, what's up ${body.name}‼️ Long time no see, how are you bro?`);
           agent.add(variables.quickRepliesTest);
       }
       else{
           switch(lang)
           {
               case 'en':
                   agent.add(`Hello ${body.name}‼️`);
                   agent.add(variables.quickReplies2E);
                   break;
               case 'fr':
                   agent.add(`Bonjour ${body.name}‼️`);
                   agent.add(variables.quickReplies2F);
                   break;
               case 'vi':
                   agent.add(`Sin trào ${body.name}‼️`);
                   agent.add(variables.quickReplies2V);
                   break;
           }
       }
       // eslint-disable-next-line promise/no-nesting
       return variables.admin.database().ref(`data`).once(`value`).then((snapshot)=>{
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
               if(valeur === index.user_id) {
                   deja = true;
                   break;
               }
           }
           // eslint-disable-next-line promise/always-return
           if(deja === false) {
               variables.admin.database().ref('data/userID').child(`${position}`).set(index.user_id);
           }
       });
   });
}

module.exports = welcome;