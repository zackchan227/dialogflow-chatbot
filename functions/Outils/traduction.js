const variables = require('../variables');
const projectId = 'mr-fap-naainy';
const {Translate} = require('@google-cloud/translate').v2;
const translate = new Translate({projectId});

// Translate function from any languages to another (Available in 4 languages)
async function traduction(agent) {       
    var text = agent.parameters['any']; // The text to translate
    var lang = agent.parameters['language']; // The target language
    var iso; // The target language's iso code
   
    switch(lang)
    {
        case 'Anglais':
        case 'English':
        case 'english':
        case 'tiếng anh':
        case 'tiếng end':
        case 'tiếng Mỹ':
        case 'tiếng mỹ':
        case 'endrjsk':
        case 'engrisk':
        case 'Tiếng Anh':
        case '英语':
        case '英文':
            iso = 'en';
            break;
        case 'Française':
        case 'Français':
        case 'Francaise':
        case 'Francais':
        case 'French':
        case 'tiếng pháp':
        case 'Tiếng Pháp':
        case 'Tiếng FAP':
        case 'tiếng fap':
        case 'fap':
        case '法语':
        case '法文':
            iso = 'fr';
            break;
        case 'Vietnamien':
        case 'Vietnamese':
        case 'vietnamese':
        case 'vietnamien':
        case 'Tiếng Việt':
        case 'tiếng việt':
        case 'tiếng vịt':
        case 'tiếng Vịt':
        case 'Tiếng Vịt':
        case 'vịt':
        case '越南语':
        case '越南文':
            iso = 'vi';
            break;
        case 'Chinois':
        case 'Chinese':
        case 'Tiếng Trung':
        case 'Tiếng Tàu':
        case 'Tiếng Hoa':
        case 'tiếng trung quốc':
        case 'trung quốc':
        case 'trung':
        case 'tiếng tàu':
        case '中文':
        case '华语':
            iso = 'zh';
            break;
        default:
            iso = 'null';
            agent.add(`Pardon, la langue ${lang} n'est pas encore supporté.`);
            agent.add(variables.quickReplies2F);
            return;
    }
 
    const [translation] = await translate.translate(text, iso);
    agent.add(`${text} en ${lang}: ${translation}`);
    agent.add(variables.quickReplies2F);
  }
  module.exports = traduction;