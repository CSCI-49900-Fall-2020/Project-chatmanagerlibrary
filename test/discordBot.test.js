const assert = require('assert');
const DiscordBot = require('../discordBot')
require('dotenv').config();

const discordBot = new DiscordBot(process.env.DISCORD_BOT_TOKEN);
channelId = process.env.TEST_DISCORD_CHANNEL;

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
    const members = await discordBot.getMembers().map(m => m.username);
    assert.ok(members, 'getMembers is ok');
  });

  it('test sendMessageToAllChannels', async () => {
    const res = await discordBot.sendMessageToAllChannels('Hello World');
    assert.ok(res, 'sendMessageToAllChannels is ok');
  });

  it('test sendFile', async () => {
    discordBot.sendFile('../src/test_files/source.gif', channelId, (response) => {response.then(function(res){assert.ok(res, 'sendFile is ok')})});
  });

  it('test sendGoogleForm', async() => {
    discordBot.sendGoogleForm('https://forms.gle/Beyb8EuojwJwqXTw9', channelId, (response) => {response.then(function(res){assert.ok(res, 'sendFile is ok')})});
  })
  
});