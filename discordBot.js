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

  sendMessageToAllChannels(msg) {
    const sendAll = this.client.channels.cache
      .filter(ch => ch.type == 'text')
      .map(ch => ch.send(msg));

    return Promise.all(sendAll);
  }

  sendMessageChannel(channelId, message) {
    return this.client.channels.cache
      .get(channelId)
      .send(message);
  }

  getChannels() {
    // filter the voice channel
    return this.client.channels.cache
        .filter(ch => ch.type == 'text')
        .map(channel => ({
      id: channel.id,
      name: channel.name,
    }));
  }

  async getMembers() {
    return this.client.users.cache.array();
  }

  stop() {
    return this.client.destroy();
  }
}

module.exports = DiscordBot;