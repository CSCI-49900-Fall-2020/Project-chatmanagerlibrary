const {Client, MessageAttachment} = require('discord.js'),
      http    = require('http');

class DiscordBot {
  constructor(DISCORD_BOT_TOKEN) {
    this.client = new Client();
    this.token  = DISCORD_BOT_TOKEN;
  }

 start() {
    try {
      const client = this.client;
      const loginStatus = client.login(this.token);
      client.once('ready', () => {
        console.log('Discord Ready!');
      });
      return loginStatus;
    } catch(err){
      return err;
    }

    // need to be able to give the ability to the programmer to make commands 
    // without interacting directly with discord api if we want to add that functionality

    // client.on('guildMemberAdd', member => {
    //   const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');

    //   if (!channel) return;
    //   channel.send(`Welcome to the server, ${member}`);
    // });

    // client.on('message', async message => {
    //   const PREFIX = '*';
    //   if (message.content.startsWith(PREFIX)) {
    //     const input = message.content.slice(PREFIX.length).trim().split(' ');
    //     const command = input.shift();
    //     const commandArgs = input.join(' ');

    //     if (command === 'pm') {
    //       //TODO parse the argument
    //       message.channel.send(`send a private message: ${commandArgs}`);
    //     }

    //     if (command === 'gm') {
    //       message.channel.send(`send a group message: ${commandArgs}`);
    //     }

    //     if (command === 'm') {
    //       const usernames = await this.getMembers().map(m => m.username);
    //       message.channel.send(`Here are all the members: ${usernames}`);
    //     }
    //   }
    // });
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
    try {
      this.client.on('ready', () => {
        var attachment = new MessageAttachment(filePath);
        this.client.channels.cache.get(channelId).send(attachment);
        return 'success';  
      })    
    } catch(err){
      return err;
    }
  }

  sendGoogleForm(googleFormUrl, channelId){
    try {
      this.client.on('ready', () => {
        this.client.channels.cache.get(channelId).send(googleFormUrl);
        return 'success';
      })
    } catch(err){
      return err;
    }
  }

  listenForGoogleFormSubmissions(port, callback){
    try {
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
    } catch(err){
      return err;
    }
  }

  getMembers() {
    return this.client.users.cache;
  }
}

module.exports = DiscordBot;