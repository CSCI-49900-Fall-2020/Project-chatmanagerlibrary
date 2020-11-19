const assert = require('assert');
const ChatBotManager = require('../chatBotManager')
require('dotenv').config();

const option = {
  slackBotConfig: {
    oauthToken: process.env.SLACK_BOT_OAUTH_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    eventPort: process.env.SLACK_EVENT_PORT,
    interactiveMessagePort: process.env.SLACK_INTERACTIVE_MESSAGE_PORT,
  },
  discordBotConfig: {
    token: process.env.DISCORD_BOT_TOKEN,
  },
};

const chatBotManager = new ChatBotManager(option);

describe('chatBotManager', () => {
  before(() => {
    chatBotManager.start();
  });

  after(() => {
    chatBotManager.stop();
  });

  it('test discord bot config', () => {
    assert.ok(chatBotManager.discordBot, 'discordBot is configured');
  });

  it('test slack bot config', () => {
    assert.ok(chatBotManager.slackBot, 'slackBot is configured');
  });

  it('test discord', (done) => {
    const { discordBot } = chatBotManager;
    discordBot.client.once('ready', () => {
      assert.ok(discordBot, 'discordBot is ready');
      done();
    });
  });

  it('test send group message to discord', async () => {
    const res = await chatBotManager.sendMessageToAllChannels({
      platform: 'discord',
      message: 'hello'
    });

    assert.ok(res, 'send group message to discord is ok');
  });

  it('test send group message to slack', async () => {
    const res = await chatBotManager.sendMessageToAllChannels({
      platform: 'slack',
      message: 'hello'
    });

    assert.ok(res, 'send group message to slack is ok');
  });

  it('test all getChannels', async () => {
    const res = await chatBotManager.getChannels();
    assert.ok(res);
  });

  it('test getMembers', async () => {
    const members = await chatBotManager.getMembers();
    assert.ok(members);
  });
})