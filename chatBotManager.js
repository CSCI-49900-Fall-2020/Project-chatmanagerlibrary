const DiscordBot = require('./discordBot')
const { SlackBot } = require('./slackBot');

class ChatBotManager {

  /**
   * @param {Object} option - The chatBotManager configuration option
   * @param {Object} option.slackBotConfig - slack bot configuration
   * @param {string} option.slackBotConfig.signingSecret - slack bot signing secret
   * @param {Object} option.discordBotConfig - discord bot configuration
   * @param {string} option.discordBotConfig.token - discord bot token
   */
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
    this.option = option;
  }

  /**
   * Initialize the bot manager and start command listener service
   * @param {Object} app - The express app object
   * @returns {Promise[]} An promise object array for bot initialization
   */
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

    return allPromise;
  }

  /**
   * This callback type is called `eventListenerCallback` and is displayed as a global symbol.
   * @callback eventListenerCallback
   command, commandArgs, 'discord'
   * @param {string} command - The command
   * @param {string[]} commandArgs - The command arguments
   * @param {string} platform - The chat app platform, eg. slack, discord, telegram
   */

  /**
   * Setup the command listener
   * @param {eventListenerCallback} eventListener - function to handle the message event
   */
  setupCommandListener(eventListener) {
    if (this.discordBot) {
      this.discordBot.setCommandListener(eventListener);
    }

    if (this.slackBot) {
      this.slackBot.setCommandListener(eventListener);
    }
  }

  /**
   * Send message to all channels at a specific platform
   * @param {Object} data - The data that's sent to the platform
   * @param {string} data.platform - The chat app platform, eg. slack, discord, telegram
   * @param {string} data.message - The sending message
   * @returns {Promise} Promise of sending message to channel
   */
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

  /**
   * Send message to a specific channel
   * @param {Object} data - The data that's sent to the platform
   * @param {string} data.platform - The chat app platform, eg. slack, discord, telegram
   * @param {string} data.channelId - The channelId of the channel where the message is sent to
   * @param {string} data.message - The sending message
   * @returns {Promise} Promise of sending message to channel
   */
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
    } else {
      throw `platform ${platform} bot is not configured`;
    }
  }

  /**
   * Get all channels info include channel ids, channel names, and platform, return all the channels from multiple platforms
   * @returns {Object[]} A channel object array
   */
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

    return channels;
  }

  /**
   * Get all members info include user ids, user names, and platform, return all the members from multiple platforms
   * @returns {Object[]} An user object array
   */
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

  /**
   * Send direct message to private member at a specific platform
   * @param {Object} data - The data that's sent to the platform
   * @param {string} data.platform - The chat app platform, eg. slack, discord, telegram
   * @param {string} data.userId - The users' id
   * @param {string} data.message - The sending message
   * @returns {Promise} Promise of sending message to a private user
   */
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

  sendFileToChannel(data) {
    const {
      platform,
      channelId,
      url,
    } = data;

    if (platform === 'slack') {
      if (this.slackBot) {
        return this.slackBot.sendFileToChannel(channelId, url);
      } else {
        throw 'slack bot is not configured';
      }
    } else if (platform === 'discord') {
      if (this.discordBot) {
        return this.discordBot.sendFileToChannel(channelId, url);
      } else {
        throw 'discord bot is not configured';
      }
    } else {
      throw `platform ${platform} bot is not configured`;
    }
  }

  sendFileToUser(data) {
    const {
      platform,
      userId,
      url,
    } = data;

    if (platform === 'slack') {
      if (this.slackBot) {
        return this.slackBot.sendFileToUser(userId, url);
      } else {
        throw 'slack bot is not configured';
      }
    } else if (platform === 'discord') {
      if (this.discordBot) {
        return this.discordBot.sendFileToUser(userId, url);
      } else {
        throw 'discord bot is not configured';
      }
    } else {
      throw `platform ${platform} bot is not configured`;
    }
  }

  /**
   * Stop the bot service
   */
  stop() {
    if (this.discordBot) {
      this.discordBot.stop();
    }
  }
}

module.exports = ChatBotManager;
