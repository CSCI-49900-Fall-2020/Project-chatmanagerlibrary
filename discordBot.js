const {Client, MessageAttachment} = require('discord.js');
const http = require('http');
const {EventEmitter} = require('events');

const emitter = new EventEmitter();

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
    client.on('message', async (message) => {
      if (message.content.startsWith(this.prefix)) {
        if (this.onCommandReceived) {
          const input = message.content.slice(this.prefix.length).trim().split(' ');
          const command = input.shift();
          const commandArgs = input.join(' ');
          const result = await this.onCommandReceived(command, commandArgs, 'discord');
          return message.reply(JSON.stringify(result));
        }
      }
    });

    return client.login(this.token);
  }

  async sendMessageToAllChannels(msg) {
    const channels = await this.fetchChannelsInternal();
    const sendAll = channels.map(ch => ch.send(msg));

    return Promise.all(sendAll);
  }

  async sendMessageChannel(channelId, message) {
    const channel = await this.client.channels.fetch(channelId);
    return channel.send(message);
  }

  // fetch the channels from discord server
  async fetchChannelsInternal() {
    let allChannels = [];

    // fetch the members from all guilds to make sure the member is updated to date
    let guilds = this.client.guilds.cache.array();
    for (let guild of guilds) {
      await guild.fetch();

      // filter to get text channel only
      const channels = guild.channels.cache.array()
          .filter(ch => ch.type == 'text');

      for (let channel of channels) {
        allChannels.push(channel);
      }
    }

    return allChannels;
  }

  async getChannels() {
    const channels = await this.fetchChannelsInternal();
    return channels.map(ch => ({
      id: ch.id,
      name: ch.name,
    }))
  }

  async getMembers() {
    let allMembers = [];

    // fetch the members from all guilds to make sure the member is updated to date
    let guilds = this.client.guilds.cache.array();
    for (let guild of guilds) {
      await guild.fetch();

      // fetch the member on each guild
      const members = await guild.members.fetch();
      const guildMembers = members.array();
      for (const guildMember of guildMembers) {
        allMembers.push({
          id: guildMember.user.id,
          name: guildMember.user.username,
        });
      }
    }

    // remove the duplicated users
    const uniqueIds = [];
    allMembers = allMembers.filter(member => {
      if (uniqueIds.includes(member.id)) {
        return false;
      }
      uniqueIds.push(member.id);
      return true;
    })

    return allMembers;
  }

  async sendDirectMessage(userId, message) {
    const user = await this.client.users.fetch(userId);
    return user.send(message);
  }

  stop() {
    return this.client.destroy();
  }

  async sendFileToChannel(channelId, url) {
    const channel = await this.client.channels.fetch(channelId);
    const attachment = new MessageAttachment(url);
    return channel.send(attachment);
  }

  async sendFileToUser(userId, url) {
    const user = await this.client.users.fetch(userId);
    const attachment = new MessageAttachment(url);
    return user.send(attachment);
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

  listenForFormsWithExpress(callback){
    emitter.on('formSubmitted', (data) => {
      callback(data);
    })
  }

  formsExpressMiddleware(req,res,next){
    let answers = [];
    req.on('error', (err) => {
      return err;
    }).on('data', (bodyData) => {
      answers.push(bodyData);
    }).on('end', async () => {
      answers = await Buffer.concat(answers).toString();
      emitter.emit('formSubmitted', answers)
    })
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