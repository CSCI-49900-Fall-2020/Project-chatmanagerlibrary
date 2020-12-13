const DiscordBot = require('./discordBot')
const { SlackBot } = require('./slackBot')
const TelegramBot = require('./telegramBot')

class ChatBotManager {
  constructor(option) {
    const {
      slackBotConfig,
      discordBotConfig,
      telegramBotConfig
    } = option;

    // check if we have slack config
    if (slackBotConfig) {
      const {
        oauthToken,
        signingSecret,
      } = slackBotConfig;
      this.slackBot = new SlackBot(oauthToken, signingSecret);
    }

    // check if we have discord config
    if (discordBotConfig) {
      const {
        token: discordToken,
      } = discordBotConfig;
      this.discordBot = new DiscordBot(discordToken);
    }

    // check if we have telegram config
    if(telegramBotConfig){
      const{
        teleToken: telegramToken
      } = telegramBotConfig;
      this.telegramBot = new TelegramBot(teleToken);
    }

    this.option = option;
  }

  start(app) {
    const allPromise = [];

    if (this.discordBot) {
      const res = this.discordBot.start();
      allPromise.push(res);
    }

    if (this.slackBot) {
      const {
        eventPort,
        interactiveMessagePort,
        slackEventAPIPath,
        slackSlashCommandPath,
      } = this.option.slackBotConfig;

      // create an slack app if there's no existing app running
      if (app) {
        if (slackSlashCommandPath == null) {
          throw 'slackSlashCommandPath is not provided for slack command slash listener'
        }

        app.use('/slack-command', this.slackBot.getSlashCommandListener());
      } else {
        const res = this.slackBot.start(eventPort, interactiveMessagePort);  
        allPromise.push(res);
      }
    }

    if (this.telegramBot) {
      const res = this.telegramBot.start();
      allPromise.push(res);
    }

    return allPromise;
  }

  setupCommandListener(eventListener) {
    if (this.discordBot) {
      this.discordBot.setCommandListener(eventListener);
    }

    if (this.slackBot) {
      this.slackBot.setCommandListener(eventListener);
    }

    if (this.telegramBot)  {
      this.telegramBot.setCommandListener(eventListener);
    }
  }

  sendMessageToAllChannels(data) {
    const {
      platform,
      message,
    } = data;

    if (platform === 'slack') {
      if (this.slackBot) {
        return this.slackBot.sendMessageToAllChannels(message);
      } else {
        throw 'slack bot is not configured';
      }
    } else if (platform === 'discord') {
      if (this.discordBot) {
        return this.discordBot.sendMessageToAllChannels(message);
      } else {
        throw 'discord bot is not configured';
      }
    } else if (platform === 'telegram') {
      if (this.telegramBot) {
        return this.telegramBot.sendMessageToAllChannels(message);
      } else {
        throw 'telegram bot is not configured';
      }
    } else {
      throw `platform ${platform} bot is not configured`;
    }
  }

  sendMessageChannel(data) {
    const {
      platform,
      channelId,
      message,
    } = data;

    if (platform === 'slack') {
      if (this.slackBot) {
        return this.slackBot.sendMessageChannel(channelId, message);
      } else {
        throw 'slack bot is not configured';
      }
    } else if (platform === 'discord') {
      if (this.discordBot) {
        return this.discordBot.sendMessageChannel(channelId, message);
      } else {
        throw 'discord bot is not configured';
      }
    } else if (platform === 'telegram') {
      if (this.telegramBot) {
        return this.telegramBot.sendMessageToAllChannels(message);
      } else {
        throw 'telegram bot is not configured';
      }
    } else {
      throw `platform ${platform} bot is not configured`;
    }
  }

  // return all the channels from multiple platforms
  async getChannels() {
    const channels = [];

    if (this.slackBot) {
      const slackChannels = await this.slackBot.getChannels();  
      for (const ch of slackChannels) {
        channels.push({
          id: ch.id,
          name: ch.name,
          platform: 'slack'
        });
      }
    }
    
    if (this.discordBot) {
      const discordChannels = await this.discordBot.getChannels();
      for (const ch of discordChannels) {
        channels.push({
          id: ch.id,
          name: ch.name,
          platform: 'discord'
        })
      }
    }

    if (this.telegramBot) {
      const telegramChannel = this.telegramBot.getChannels();
      channels.push({
        id: telegramChannel.chatID,
        name: telegramChannel.chatTitle
      })
    }

    return channels;
  }

  async getMembers() {
    const members = [];
    if (this.slackBot) {
      const res = await this.slackBot.getMembers();
      for (const user of res.members) {
        members.push({
          id: user.id,
          name: user.name,
          platform: 'slack'
        })
      }
    }

    if (this.discordBot) {
      const res = await this.discordBot.getMembers();
      for (const user of res) {
        members.push({
          id: user.id,
          name: user.name,
          platform: 'discord'
        })
      }
    }

    return members;
  }

  sendDirectMessage(data) {
    const {
      platform,
      userId,
      message,
    } = data;

    if (platform === 'slack') {
      if (this.slackBot) {
        return this.slackBot.sendDirectMessage(userId, message);
      } else {
        throw 'slack bot is not configured';
      }
    } else if (platform === 'discord') {
      if (this.discordBot) {
        return this.discordBot.sendDirectMessage(userId, message);
      } else {
        throw 'discord bot is not configured';
      }
    } else {
      throw `platform ${platform} bot is not configured`;
    }
  }

  stop() {
    if (this.discordBot) {
      this.discordBot.stop();
    }
  }
}

module.exports = ChatBotManager;