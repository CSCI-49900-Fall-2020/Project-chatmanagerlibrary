const DiscordBot = require('./discordBot')
const { SlackBot } = require('./slackBot');

class ChatBotManager {
  constructor(option) {
    const {
      slackBotConfig,
      discordBotConfig,
    } = option;

    // check if we have slack config
    if (slackBotConfig) {
      const {
        oauthToken,
        signingSecret,
        eventPort,
        interactiveMessagePort,
      } = slackBotConfig;

      const slackBot = new SlackBot(oauthToken, signingSecret);
      this.slackBot = slackBot;
    }

    // check if we have discord config
    if (discordBotConfig) {
      const {
        token: discordToken,
      } = discordBotConfig;

      const discordBot = new DiscordBot(discordToken);
      this.discordBot = discordBot;
    }
    this.option = option;
  }

  start() {
    const allPromise = [];

    if (this.discordBot) {
      const res = this.discordBot.start();
      allPromise.push(res);
    }

    if (this.slackBot) {
      const {
      eventPort,
      interactiveMessagePort,
    } = this.option.slackBotConfig;

     const res = this.slackBot.start(eventPort, interactiveMessagePort);
      allPromise.push(res);
    }

    return allPromise;
  }

  setupCommandListener(eventListener) {
    if (this.discordBot) {
      this.discordBot.setCommandListener(eventListener);
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