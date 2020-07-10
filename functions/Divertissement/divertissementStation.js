const variables = require('../variables');
const index = require('../index');

    var datetime = new Date();
    var dd = datetime.getDate();
    var mm = datetime.getMonth()+1;
    function divertissementStation(agent) {     
        var mois;
        switch(mm){
            case 1:
                mois = "Janvier";
                break;
            case 2:
                mois = "Février";
                break;
            case 3:
                mois = "Mars";
                break;
            case 4:
                mois = "Avril";
                break;
            case 5:
                mois = "Mai";
                break;
            case 6:
                mois = "Juin";
                break;
            case 7:
                mois = "Juillet";
                break;
            case 8:
                mois = "Août";
                break;
            case 9:
                mois = "Septembre";
                break;
            case 10:
                mois = "Octobre";
                break;
            case 11:
                mois = "Novembre";
                break;
            case 12:
                mois = "Décembre";
                break;
        }

        var yyyy = datetime.getFullYear();

        agent.add(`Aujourd'hui c'est: ${dd} ${mois} ${yyyy}`);
        agent.add(variables.quickRepliesDivertissement);
    }
    module.exports = divertissementStation;
