const DiscordBot = require('./discordBot')
const { SlackBot } = require('./slackBot');

class ChatBotManager {

  /**
   * @param {Object} option - The chatBotManager configuration option
   * @param {Object} option.slackBotConfig - slack bot configuration
   * @param {string} option.slackBotConfig.signingSecret - slack bot signing secret
   * @param {string} option.slackBotConfig.slashCommandPath - slack slash express middleware path
   * @param {Object} option.discordBotConfig - discord bot configuration
   * @param {string} option.discordBotConfig.token - discord bot token
   * @param {Object} option.commandConfig - command configuration
   * @param {Object} option.commandConfig.privateMessage - private message command
   * @param {Object} option.commandConfig.groupMessage - group message command
   * @param {Object} option.commandConfig.sendFile - send file command
   * @param {Object} option.commandConfig.help - help command
   * @param {Object} option.commandConfig.list - list command
   */
  constructor(option) {
    const {
      slackBotConfig,
      discordBotConfig,
    } = option;

    this.commandListener = {}

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
    const commandConfig = this.option.commandConfig || {
      directMessage: 'pm',
      groupMessage: 'gm',
      sendFile: 'file',
      help: 'help',
      list: 'ls',
    }

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

      // create an slack app if there's no existing app running
      if (app) {
        // use '/slack-command' as slash command path by default
        const slackSlashCommandPath = this.option.slackBotConfig.slashCommandPath || 'slack-command'
        app.use(`/${slackSlashCommandPath}`, this.slackBot.getSlashCommandListener());
      } else {
        const res = this.slackBot.start(eventPort, interactiveMessagePort);  
        allPromise.push(res);
      }
    }

    // command: the command sent by the user
    // commandArgs: the command arguments sent by the user
    // source: where the command sent to
    const onCommandReceived = async (command, commandArgs, sender) => {
      if (command === commandConfig.directMessage) {
        const tmp = commandArgs.split(' ');
        const platform = tmp.shift();
        const userId = tmp.shift();
        const message = tmp.join(' ');
        const data = {
          platform,
          userId,
          message,
          sender,
        };

        await this.sendDirectMessage(data);
        return {
          "result": "message sent",
        };
      } else if (command === commandConfig.groupMessage) {
        const tmp = commandArgs.split(' ');
        const platform = tmp.shift();
        const channelId = tmp.shift();
        const message = tmp.join(' ');
        const data = {
          platform,
          channelId,
          message,
          sender,
        };

        await this.sendMessageChannel(data);
        return {
          "result": "message sent",
        };
      } else if (command === commandConfig.list) {
        const tmp = commandArgs.split(' ');
        const lsType = tmp.shift();
        const platform = tmp.shift();
        if (lsType === 'channel') {
          const allChannels = await this.getChannels();
          if (platform) {
            return allChannels.filter(ch => ch.platform === platform);
          }

          return allChannels;
        } if (lsType === 'member') {
          const allMembers = await this.getMembers();
          if (platform) {
            return allMembers.filter(m => m.platform === platform);
          }

          return allMembers;
        }
      }

      if (command in this.commandListener) {
        if (this.commandListener[command]) {
          // listener for user who would like to subscribe the command event
          return this.commandListener[command](command, commandArgs, sender);
        }
      } else {
        throw `command: ${command} doesn't exist !`
      }
    }

    if (this.discordBot) {
      this.discordBot.setCommandListener(onCommandReceived);
    }

    if (this.slackBot) {
      this.slackBot.setCommandListener(onCommandReceived);
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
   * @return {Promise}
   */

  /**
   * Setup the command listener for a specific command
   * @param {command} command - the command to subscribe to
   * @param {eventListenerCallback} eventListener - function to handle the message event
   */
  setupCommandListener(command, eventListener) {
    this.commandListener[command] = eventListener;
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
