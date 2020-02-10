# dialogflow-chatbot
## Quiz french chatbot with dialogflow using nodejs and firebase

&nbsp;
### <u>How to Clone a GitHub Repository using VS Code</u>

Step 1 : Open Visual Studio Code

Step 2 : Go to View -> Command palette or Ctrl + Shift + P

Step 3 : Type Git: Clone then Enter

Step 4 : Copy this repository URL https://github.com/zackchan227/dialogflow-chatbot.git then Enter

Step 5 : Select the path folder that you want to clone.

Step 6 : Finish Cloning. Ta da !


&nbsp;
### <u>How to run "Dialogflow-chatbot"</u>

Step 1: Open terminal

Step 2: Type "cd functions"

Step 3: Type "npm install"

Step 4: After modify the project, deploy to firebase by "firebase deploy" or "firebase deploy --only functions"

Step 5: "Dialogflow-chatbot" is ready to serve

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
             
