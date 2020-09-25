const Discord = require('discord.js');
const PREFIX = '*';

class DiscordBot {
  constructor() {
    const client = new Discord.Client();
    this.client = client;
  }

  start() {
    const token = process.env.DISCORD_BOT_TOKEN;
    const client = this.client;
    client.once('ready', () => {
      console.log('Discord Ready!');
    });

    client.on('guildMemberAdd', member => {
      const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');

      if (!channel) return;
      channel.send(`Welcome to the server, ${member}`);
    });

    client.on('message', async message => {
      if (message.content.startsWith(PREFIX)) {
        const input = message.content.slice(PREFIX.length).trim().split(' ');
        const command = input.shift();
        const commandArgs = input.join(' ');

        if (command === 'pm') {
          //TODO parse the argument
          message.channel.send(`send a private message: ${commandArgs}`);
        }

        if (command === 'gm') {
          message.channel.send(`send a group message: ${commandArgs}`);
        }

        if (command === 'm') {
          const usernames = await this.getMembers().map(m => m.username);
          message.channel.send(`Here are all the members: ${usernames}`);
        }
      }
    });

     return client.login(token);
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
}

module.exports = DiscordBot;