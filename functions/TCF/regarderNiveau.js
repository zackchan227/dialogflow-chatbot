const variables = require('../variables');
const index = require('../index');

function regarderNiveau(agent){
    var valeur;
    var niveau;
    var score = ['','','','',''];
    var temp,temp1;
    var finalScore ='';
    var count = 0;
    return variables.ref.once(`value`).then((snapshot)=>{
        valeur = snapshot.child(`scores/${index.user_id}`).val(); 
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
        // eslint-disable-next-line promise/always-return
        if(valeur >= 6969){
            niveau = "Vô ∞ Cực";
        }
        agent.add(`Votre niveau: ${niveau}`);
        agent.add(`Votre score: ${finalScore}`);
        agent.add(variables.quickRepliesNiveau);
    });
}

module.exports = regarderNiveau;