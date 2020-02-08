# dialogflow-chatbot
## Quiz french chatbot with dialogflow using nodejs and firebase

&nbsp;
### How to Clone a GitHub Repository using VS Code

Step 1 : Open Visual Studio Code

Step 2 : Go to View -> Command palette or Ctrl + Shift + P

Step 3 : Type Git: Clone then Enter

Step 4 : Copy this repository URL https://github.com/zackchan227/dialogflow-chatbot.git then Enter

Step 5 : Select the path folder that you want to clone.

Step 6 : Finish Cloning. Ta da !


&nbsp;
### How to run "Dialogflow-chatbot"

Step 1: Open terminal

Step 2: Type "cd functions"

Step 3: Type "npm install"

Step 4: After modify the project, deploy to firebase by "firebase deploy" or "firebase deploy --only functions"

Step 5: "Dialogflow-chatbot" is ready to serve

&nbsp;
### Common error:
1. Receive error: "....npm ERR! enoent undefined ls-remote -h -t https://github.com/naranjja/dialogflow-fulfillment-nodejs.git..." when install npm
**Solution: Modify package.json 
    Step 1: change "dialogflow-fulfillment": "git+https://github.com/naranjja dialogflow-fulfillment-nodejs.git" to              "dialogflow-fulfillment": "^0.5.0"
    
    Step 2: run "npm install" in terminal

    Step 3: replace "dialogflow-fulfillment": "^0.5.0" with "dialogflow-fulfillment": "git+https://github.com/naranjja           dialogflow-fulfillment-nodejs.git"

    Step 4: "Dialogflow-chatbot" is ready to serve

2. Dialogflow-chatbot get stuck
**Solution: Take a look if $user_id is a global variable or not. This mistake can cause so many problem, even when you redeploy an older function to fix it. Your app will still get stuck for an hour or more.
             
