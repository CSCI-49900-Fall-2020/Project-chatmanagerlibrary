# Project-ChatManagerLibrary

To add slackbot into your project use:
  ```javascript
  const { SlackBot } = require ('slackbot.js');
  ```
In order to use a slackbot you must create a new app using the following link: https://api.slack.com/apps
give your bot the necessary permissions and copy the secret signing token as well as the slack bot token.

To start a slackbot use the following:
  ```javascript
    let slackBot = new SlackBot("slack_bot_token_here", "slack_signing_secret_here");
    // starts the slackbot on default ports 3000 for events and 3001 for interactive messages if you dont provide any ports
    slackbot.start("port_for_events", "port_for_interactive_messages");
  ```
  
Now you should be able to enter the correct urls into slack apps features: events and interactive messages. 
If you are working in a local enviroment you can use ngrok to test just add /slack/events and slack/actions
at the end of the url under the appropritate feature. under test files there is an ngrok config file just your 
auth token and run:
  ```
    ngrok start --config=ngrokconfig.yml first second
  ```
  
  after initial setup you can use the test file under src/test_files (after editing with appropriate credentials) to see bot 
  in action
