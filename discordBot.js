const {Client, MessageAttachment} = require('discord.js');
const http = require('http');

class DiscordBot {
  constructor(DISCORD_BOT_TOKEN) {
    this.client = new Client();
    this.token  = DISCORD_BOT_TOKEN;
  }

  //starts discord bot
  start() {
      const client = this.client;
      const loginStatus = client.login(this.token);
      client.once('ready', () => {
        console.log('Discord Ready!');
      });
      return loginStatus;
  }

  //need to be able to send to any channel or add another function to send to specific 
  //channels so must take channel id as an argument
  sendMessageToAllChannels(msg) {
    this.client.on('ready', () => {
      const sendAll = this.client.channels.cache
      .filter(ch => ch.type == 'text')
      .map(ch => ch.send(msg));

    return Promise.all(sendAll);
    })
  }

  // send files to discord channel given the file path and channel
  sendFile(filePath, channelId){
    this.client.on('ready', () => {
      var attachment = new MessageAttachment(filePath);
      this.client.channels.cache.get(channelId).send(attachment);
      return 'success';  
    })    
  }

  //sends google form url to a discord channel given a google form url and a channel id
  sendGoogleForm(googleFormUrl, channelId){
    this.client.on('ready', () => {
      this.client.channels.cache.get(channelId).send(googleFormUrl);
      return 'success';
    })
  }

  //gets responses from google form submissions given a port to listen
  listenForGoogleFormSubmissions(port, callback){
    this.client.on('ready', () => {
      http.createServer((request) => {
        let answers = [];
        request.on('error', (err) => {
          throw err;
        }).on('data', (bodyData) => {
          answers.push(bodyData);
        }).on('end', async () => {
          answers = await Buffer.concat(answers).toString();
          callback(answers);
        })
      }).listen(port);
    })
  }

  getMembers() {
    return this.client.users.cache;
  }
}

module.exports = DiscordBot;