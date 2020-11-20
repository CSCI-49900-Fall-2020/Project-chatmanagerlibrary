const assert = require('assert');
const DiscordBot = require('../discordBot')
require('dotenv').config();

const discordBot = new DiscordBot(process.env.DISCORD_BOT_TOKEN);
const channelId = process.env.DISCORD_TEST_CHANNEL;
const googleFormUrl = process.env.TEST_FORM_URL;
const discordTestUserId = process.env.DISCORD_TEST_USER;

describe('discordBot', () => {
  before((done) => {
    discordBot.start();
    discordBot.client.once('ready', () => {
      done();
    });
  });

  after(() => {
    discordBot.stop();
  });

  it('test getMembers', async () => {
    const members = await discordBot.getMembers();
    assert.ok(members);
  });

  it('test sendMessageToAllChannels', async () => {
    const res = await discordBot.sendMessageToAllChannels('Hello World');
    assert.ok(res, 'sendMessageToAllChannels is ok');
  });

  it('test sendFile', async () => {
    discordBot.sendFile('../src/test_files/source.gif', channelId, (res) => {assert.ok(res, 'sendFile is ok')})
  });

  it('test sendGoogleForm', async() => {
    discordBot.sendGoogleForm(googleFormUrl, channelId, (res) => {assert.ok(res, 'sendGoogleForm is ok')});
  })
  
  it('test getChannels', async () => {
    const channels = await discordBot.getChannels();
    assert.ok(channels);
  });

  it('test sendDirectMessage', async () => {
    const res = await discordBot.sendDirectMessage(discordTestUserId, 'direct message');
    assert.ok(res);
  });
});

