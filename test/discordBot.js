const assert = require('assert');
const DiscordBot = require('../discordBot')
require('dotenv').config();

const discordBot = new DiscordBot();

describe('discordBot', function() {
  beforeEach(async() => {
    discordBot.start();
  })

  it('test discord bot service', async () => {
    assert.ok(discordBot, 'discordBot is ok');
  })
  
  it('test getMembers', async () => {
    const members = await discordBot.getMembers().map(m => m.username);
    assert.ok(members, 'getMembers is ok');
  })
  
  it('test sendMessageToAllChannels', async () => {
    const res = await discordBot.sendMessageToAllChannels('Hello World');
    assert.ok(res, 'sendMessageToAllChannels is ok');
  })
  
})