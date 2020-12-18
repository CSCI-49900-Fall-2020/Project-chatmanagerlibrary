const assert = require('assert');
const ChatBotManager = require('../chatBotManager')
require('dotenv').config();

const slackTestUserId = process.env.SLACK_TEST_USER;
const slackTestChannelId = process.env.TEST_SLACK_CHANNEL;
const discordTestUserId = process.env.DISCORD_TEST_USER;
const discordTestChannelId = process.env.DISCORD_TEST_CHANNEL;

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
  telegramBotConfig: {
    telegramToken: process.env.TELEGRAM_BOT_TOKEN
  }
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

  it('test telegram bot config', () => {
    assert.ok(chatBotManager.telegramBot, 'telegramBot is configured');
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

  it('test send direct message to discord', async () => {
    const res = await chatBotManager.sendDirectMessage({
      platform: 'discord',
      userId: discordTestUserId,
      message: 'direct_hello'
    });
    assert.ok(res, 'send direct message to discord is ok');
  });

  it('test send direct message to slack', async () => {
    const res = await chatBotManager.sendDirectMessage({
      platform: 'slack',
      userId: slackTestUserId,
      message: 'direct_message_hello'
    });
    assert.ok(res, 'send direct message to slack is ok');
  });

  it('test send group message to discord', async () => {
    const res = await chatBotManager.sendMessageChannel({
      platform: 'discord',
      channelId: discordTestChannelId,
      message: 'group_channel_hello'
    });
    assert.ok(res, 'send group message to discord is ok');
  });

  it('test send group message to slack', async () => {
    const res = await chatBotManager.sendMessageChannel({
      platform: 'slack',
      channelId: slackTestChannelId,
      message: 'group_message_hello'
    });
    assert.ok(res, 'send group message to slack is ok');
  });

  it('test send file to discord user', async () => {
    const res = await chatBotManager.sendFileToUser({
      platform: 'discord',
      userId: discordTestUserId,
      url: 'https://i.imgur.com/w3duR07.png'
    });
    assert.ok(res, 'send a file to discord user is ok');
  });

  it('test send file to slack user', async () => {
    const res = await chatBotManager.sendFileToUser({
      platform: 'slack',
      userId: slackTestUserId,
      url: 'https://i.imgur.com/w3duR07.png'
    });
    assert.ok(res, 'send a file to slack user is ok');
  });

  it('test send file to discord channel', async () => {
    const res = await chatBotManager.sendFileToChannel({
      platform: 'discord',
      channelId: discordTestChannelId,
      url: 'https://i.imgur.com/w3duR07.png'
    });
    assert.ok(res, 'send a file to discord channel is ok');
  });

  it('test send file to slack user', async () => {
    const res = await chatBotManager.sendFileToChannel({
      platform: 'slack',
      channelId: slackTestChannelId,
      url: 'https://i.imgur.com/w3duR07.png'
    });
    assert.ok(res, 'send a file to slack channel is ok');
  });
})

