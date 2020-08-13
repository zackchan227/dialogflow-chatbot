# Parlez Vous Francaiss 
ParlezVousFrancaiss is a Facebook Messenger Bot integrates with Dialogflow that supports users for learning French with these features: multiple-choice questions, definition of words, synonyms; antonyms, translation, horoscopes, tarots, French proficiency assessment system (non-professional) which using NodeJS & JavaScript for back-end code, Cloud Function for Firebase to run back-end code with a serverless framework and Firebase Realtime Database to save the questions and users's data.
&nbsp;

## Table of Contents
1. [Try Now](#try-now)
2. [Features](#features)
3. [Usage](#example2)
4. [Expected Features](#expected-features)
5. [Appendix](#Appendix)

## [Try Now](https://www.facebook.com/messages/t/ParlezVousFrancaiss)
## Features:
* Chat with chatbot by message
* Answer multiple choice questions for the TCF
* Look up common idioms and expressions
* Translate words and phrases into Vietnamese, English, and vice versa
* Look up definitions, synonyms and antonyms of a word
* Entertain by viewing horoscopes, Chinese horoscopes and tarots
* Contact the administrator and the mentor

## Usage
### [Build a program on Dialogflow](https://cloud.google.com/dialogflow/docs/quick/build-agent#create-an-agent)
### [Download an pre-built agent](https://drive.google.com/file/d/1aZL37R4eEenHWVx_8-Xd6JXawtoRUTjt/view?usp=sharing)
### [Import agent](https://cloud.google.com/dialogflow/docs/quick/build-agent#import-the-example-file-to-your-agent)
### [Billing your project on google cloud](https://console.cloud.google.com/billing)
### [Create and deploy function on google cloud](https://cloud.google.com/functions/docs/quickstart-console#create_a_function)
### [Add your project to Firebase](https://console.firebase.google.com/)
### [Download a json file which contains data of project](https://drive.google.com/file/d/11nDuO-OKdNDYsa4TXMhfhsbjBB_OC8hi/view?usp=sharing)
### [Import data file in Realtime Database](https://support.google.com/firebase/answer/6386780?hl=en)
### [Remember to replace your service accounts in file variables.js](https://firebase.google.com/docs/admin/setup)
### [Connect the webhook to Dialogflow](https://developers.google.com/assistant/conversational/df-asdk/deploy-fulfillment#connect)
### [Deploy Fulfillment to Cloud Function for Firebase](https://developers.google.com/assistant/conversational/df-asdk/deploy-fulfillment#deploy_to_cloud_functions_for_firebase)
### [Integrate Dialogflow into Facebook Messenger](https://cloud.google.com/dialogflow/docs/integrations/facebook)

## Expected Features
* Speech-to-text messaging
* Send file (mp3, mp4, jpg, png ...)
* Send message periodically
* Multi-language support
* Smarter in conversation

## Appendix
### <u>How to Clone a GitHub Repository using VS Code</u>

Step 1 : Open Visual Studio Code

Step 2 : Go to View -> Command palette or Ctrl + Shift + P

Step 3 : Type Git: Clone then Enter

Step 4 : Copy this repository URL https://github.com/zackchan227/dialogflow-chatbot.git then Enter

Step 5 : Select the path folder that you want to clone

Step 6 : Finish Cloning. Ta da !


&nbsp;
### <u>How to deploy code to Cloud Functioon for Firebase </u>

Step 1: Open terminal

Step 2: Type "cd functions"

Step 3: Type "npm install"

Step 4: After modify the project, deploy to firebase by "firebase deploy" or "firebase deploy --only functions"

Step 5: Code has been deployed

&nbsp;
### <u>How to add a new question to the database ?</u>

Step 1: Open "https://console.firebase.google.com/u/0/project/mr-fap-naainy/database/mr-fap-naainy/data"

Step 2: Add a new question to TCFquestions (be careful with the question's key, it has to be the last number + 1)

Step 3: Add its answers to TCFanswers

Step 4: Add the correct answer for your question in TCFcorrects

Step 5: Add the explication for your question to TCFnotes

Step 6: This step is really important. Fine "TCFNiveauDesQuestions", choose the exact level of your question (A1, A2, B1, B2, C1, C2), add your question's key to this part. Be careful in this step.

Step 7: Your question is ready to deploy. You may see your question in our conversation.

<u>For dev:</u> Go to index.js. And modify this variable "nombreDeQuestion" to the total number of questions !

&nbsp;
### <u>Common error:</u>
1. Receive error: "....npm ERR! enoent undefined ls-remote -h -t https://github.com/naranjja/dialogflow-fulfillment-nodejs.git..." when install npm
**Solution: Modify package.json 
    Step 1: change "dialogflow-fulfillment": "git+https://github.com/naranjja dialogflow-fulfillment-nodejs.git" to              "dialogflow-fulfillment": "^0.5.0"
    
    Step 2: run "npm install" in terminal

    Step 3: replace "dialogflow-fulfillment": "^0.5.0" with "dialogflow-fulfillment": "git+https://github.com/naranjja           dialogflow-fulfillment-nodejs.git"

    Step 4: "Dialogflow-chatbot" is ready to serve

2. Dialogflow-chatbot get stuck
**Solution: Take a look if $user_id is a global variable or not. This mistake can cause so many problem, even when you redeploy an older function to fix it. Your app will still get stuck for an hour or more.
             
