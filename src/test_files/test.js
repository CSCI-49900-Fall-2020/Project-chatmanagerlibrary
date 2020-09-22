const { SlackBot } = require('../../slackBot.js')

// json for the button needed to open the form
messageToOpenForm = {
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Click 'Open The Form' to open the form modal"
			},
			"accessory": {
                "type": "button",
                "action_id": "open_form", // this is the id we use to identify when the user clicks on the button
				"text": {
					"type": "plain_text",
					"text": "Open The Form",
					"emoji": true
				},
				"value": "clicked_me"
			}
		}
	]
}

// json for the form to send when user clicks the open form button
modalWithForm = {
  "type": "modal",
  "callback_id": "test_form",  // this is the id we use to listen for the form submission
	"title": {
		"type": "plain_text",
		"text": "My App",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Submit",
		"emoji": true
	},
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"blocks":[
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Thanks for openeing this modal!"
          }
        },
        {
          "type": "input",
          "block_id": "things_selection_block", // identifier for the selection block
          "element": {
            "type": "static_select",
            "action_id": "things_selection_element", // identifier for the selection element
            "placeholder": {
              "type": "plain_text",
              "text": "Select something",
              "emoji": true
            },
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "Test 1",
                  "emoji": true
                },
                "value": "test_1"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "Test 2",
                  "emoji": true
                },
                "value": "test_2"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "Test 3",
                  "emoji": true
                },
                "value": "test_3"
              }
            ]
          },
          "label": {
            "type": "plain_text",
            "text": "Choose something:",
            "emoji": true
          }
        },
        {
          "type": "input",
          "block_id": "things_name_block", // identifier for the input block
          "element": {
            "type": "plain_text_input",
            "action_id": "thing_name_element" //identifier for the selection element
    
          },
          "label": {
            "type": "plain_text",
            "text": "Write Something:",
            "emoji": true
          }
        }
	]
}

var slackChannel = 'ENTER SLACK CHANNEL HERE YOU CAN COPY FROM THE WEB URL WHEN YOU ARE IN THAT CHANNEL';

// create a new slackbot
let slackbot = new SlackBot(process.env.SLACK_BOT_TOKEN, process.env.SLACK_SIGNING_SECRET);

// starts the slackbot on default ports 3000 for events and 3001 for interactive messages
slackbot.start();

// send the button to open the form as well as the form to a specified channel.
slackbot.sendForm(messageToOpenForm, modalWithForm, slackChannel, 'open_form', (response, payload) => {
    // this is the response we get from sending the button
    console.log(response);
    // this is the payload we receive when a user clicks on the button
    console.log(payload);
});

// this listens for when users submit their forms
slackbot.listenForFormSubmissions('test_form', (data) => {
    // this is the users reponses in json format
    console.log(data);
});

//this sends a file to a specified channel
slackbot.sendFile(slackChannel, './source.gif', (response) => {
    // this is the server response once form is sent
    console.log(response);
});


