const {Client, MessageAttachment} = require('discord.js');
const http = require('http')

class DiscordBot {
  constructor(token) {
    this.client = new Client();
    this.token = token;
    this.prefix = '/';
  }

  setCommandListener(commandListener) {
    this.onCommandReceived = commandListener;
  }

  start() {
    const client = this.client;
    client.on('message', (message) => {
      if (message.content.startsWith(this.prefix)) {
        if (this.onCommandReceived) {
          const input = message.content.slice(this.prefix.length).trim().split(' ');
          const command = input.shift();
          const commandArgs = input.join(' ');
          this.onCommandReceived(command, commandArgs, 'discord');
        }
      }
    });
    
     return client.login(this.token);
  }

  sendMessageToAllChannels(msg) {
    const sendAll = this.client.channels.cache
      .filter(ch => ch.type == 'text')
      .map(ch => ch.send(msg));

    return Promise.all(sendAll);
  }

  getMembers() {
    return this.client.users.cache;
  }

  stop() {
    return this.client.destroy();
  }

  // send files to discord channel given the file path and channel
  async sendFile(filePath, channelId, callback){
    this.client.on('ready', async () => {
      var attachment = new MessageAttachment(filePath);
      this.client.channels.cache.get(channelId).send(attachment).then(callback);
    })    
  }

  //sends a link to a google form to the specifies channel
  sendGoogleForm(googleFormUrl, channelId, callback){
    this.client.on('ready', () => {
      return callback(this.client.channels.cache.get(channelId).send(googleFormUrl)).then(callback);
    })
  }

  //gets results everytime a google form is submitted
  listenForGoogleFormSubmissions(port, callback){
    http.createServer((request) => {
      let answers = [];
      request.on('error', (err) => {
        return err;
      }).on('data', (bodyData) => {
        answers.push(bodyData);
      }).on('end', async () => {
        answers = await Buffer.concat(answers).toString();
        callback(answers);

      })
    }).listen(port);
  }

  // can add a custom command
  addCustomCommand(command, callback){
    this.client.on('message', (message) => {
      if (message.content.split(' ')[0] == command) {
          callback(message);
      }
    })
  }
}

module.exports = DiscordBot;