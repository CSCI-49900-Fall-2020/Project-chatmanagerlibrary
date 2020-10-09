const Discord = require('discord.js');

class DiscordBot {
  constructor(token) {
    const client = new Discord.Client();
    this.client = client;
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
}

module.exports = DiscordBot;