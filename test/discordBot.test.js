const assert = require('assert');
const DiscordBot = require('../discordBot')
require('dotenv').config();

const discordBot = new DiscordBot(process.env.DISCORD_BOT_TOKEN);

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
});