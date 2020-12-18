const { WebClient }             = require('@slack/web-api'),
      { createEventAdapter }    = require('@slack/events-api'),
      { createMessageAdapter }  = require('@slack/interactive-messages'),
      { createReadStream }      = require('fs');

// this class is specifically for the slacbot for bots from other platforms create a new class
class SlackBot {
    // when we use new Slackbot you must specify the slack bot token as well as the signing secret in order to initialize it
    constructor(slackBotToken, slackSigningSecret){
      this.slackEvents = createEventAdapter(slackSigningSecret);
      this.slackInteractiveMessages = createMessageAdapter(slackSigningSecret);
      this.webClient = new WebClient(slackBotToken);
      this.prefix = '~';
    }
    
    // starts the events and interactive messages server
    async start(slackEventsPort, slackInteractiveMessagesPort) {
      const eventsServer = await this.slackEvents.start(slackEventsPort);
      console.log(`Events server has started on ${eventsServer.address().port}`);
      const interactiveMessagesServer = await this.slackInteractiveMessages.start(slackInteractiveMessagesPort);
      console.log(`InteractiveMessages server has started on ${interactiveMessagesServer.address().port}`);
    }

    eventsExpressMiddleware(req,res,next) {
      return this.slackEvents.expressMiddleware(req,res,next);
    }

    interactiveMessagesExpressMiddleware(req,res,next) {
      return this.slackInteractiveMessages.expressMiddleware(req,res,next);
    }
      
    getSlashCommandListener() {
        return async (req, res, next) => {
            if (this.onCommandReceived) {
                const commandArgs = req.body.text;
                const command = req.body.command.substring(1);
                const result = await this.onCommandReceived(command, commandArgs, 'slack');
                res.json(result);
            }
        }
    }

    setCommandListener(commandListener) {
      this.slackEvents.on('message', (message) => {
        if (message.text.startsWith(this.prefix)) {
          if (this.onCommandReceived) {
            const input = message.text.slice(this.prefix.length).trim().split(' ');
            const command = input.shift();
            const commandArgs = input.join(' ');
            this.onCommandReceived(command, commandArgs, 'slack');
          }
        }
      });
      this.onCommandReceived = commandListener;
    }

    // listens for when users submit forms, it takes the modal callback id as an input. use this after sending a form to get user responses
    async listenForFormSubmissions(modalCallbackId, callback){
        this.slackInteractiveMessages.viewSubmission(modalCallbackId, async (payload) => {
          const blockData = payload.view.state;
          // returns the user responses to the form
          callback(blockData.values);
        });
    }

    // sends the user a form, it takes a json with a button to open the form (messageJson), the forms json(modalJson), channel to send the form to(channelId) 
    //and action id for the button sent so we can listen to it and send form when the user clicks it (actionId)
    async sendForm(messageJson, modalJson, channelId, actionId, callback){
        const messageJsonBlock = {...{channel: channelId}, ...messageJson};
        const response = await this.webClient.chat.postMessage(messageJsonBlock);
        
        // sends the form when the user clicks the open form button
        this.slackInteractiveMessages.action({ actionId: actionId}, async (payload) => {
            await this.webClient.views.open({
                trigger_id: payload.trigger_id,
                view: modalJson
            }) 
            //returns the server response when we send the button (response) as well as the payload generated by the server when they click it.
            return (response,payload);
        });
    }

    // uploads a file to the specified channel, you need to provide the channelId and filepath
    async sendFile(channelId, filePath){
        return this.webClient.files.upload({channels: channelId, file: await createReadStream(filePath)});
    }

    sendMessageToChannel(channelId, message) {
      const data = {
        channel: channelId,
        text: message
      };
      return this.webClient.chat.postMessage(data);
    }

    async sendMessageToAllChannels(message) {
      const res = await this.webClient.conversations.list();
      const sendMessages = res.channels
        .filter(channel => channel.is_member)
        .map(channel => this.sendMessageToChannel(channel.id, message))
      return Promise.all(sendMessages);
    }

    async getChannels() {
      const ch = await this.webClient.conversations.list();
      return ch.channels
        .filter(channel => channel.is_member)
        .map(channel => ({
          id: channel.id,
          name: channel.name,
        })); 
    }

    getMembers() {
        return this.webClient.users.list();
    }

    sendDirectMessage(userId, message) {
        const data = {
            channel: userId,
            text: message,
            as_user: true
        };
        return this.webClient.chat.postMessage(data);
    }

    sendFileToUser(userId, url) {
        const data = {
            channel: userId,
            text: url,
            as_user: true
        };
        return this.webClient.chat.postMessage(data);
    }

    sendFileToChannel(userId, url) {
        const data = {
            channel: userId,
            text: url,
            as_user: true
        };
        return this.webClient.chat.postMessage(data);
    }

    stop(slackEventsPort, slackInteractiveMessagesPort){
      this.slackEvents.stop(slackEventsPort);
      this.slackInteractiveMessages.stop(slackInteractiveMessagesPort);
    }

    // can add a custom command
    addCustomCommand(command, callback){
      this.slackEvents.on('message', (message) => {
        if (message.text.split(' ')[0] == command) {
          callback(message);
        }
      });
    }
}

exports.SlackBot = SlackBot;