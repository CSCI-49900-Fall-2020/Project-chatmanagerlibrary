const assert = require('assert');
const { SlackBot } = require('../slackBot')
require('dotenv').config();

const slackBot = new SlackBot(process.env.SLACK_BOT_OAUTH_TOKEN, process.env.SLACK_SIGNING_SECRET)
const slackChannel = 'Enter Channel Here'

describe('slackBot', () => {
    before((done) => {
      slackBot.start();
      done()
    });

    after(() => {
        slackBot.stop();
    });

    it('test sendMessageToChannel', async() => {
        const response = await slackBot.sendMessageToChannel(slackChannel, 'testing');
        assert.ok(response, 'sendMessageToChannel is not working');
    })

    it('test sendFile', () => {
        slackBot.sendFile(slackChannel, '../src/test_files/source.gif', (response) => {
            assert.ok(response, 'sendFile is not working');
        })
    })

    it('test getChannels', async() => {
        const res = await slackBot.getChannels();
        assert.ok(res, 'getChannels is not working');
    })

    it('test getMembers', async () => {
        const members = await slackBot.getMembers();
        assert.ok(channels);
    });

    it('test sendForm', () => {
        const messageToOpenForm = {
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
        const modalWithForm = {
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

        slackBot.sendForm(messageToOpenForm, modalWithForm, slackChannel, 'open_form', (response, payload) => {
            assert([response, payload], 'sendForm is not working')
        });
    })
})
