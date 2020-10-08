const DiscordBot = require('../../discordBot.js')

//edit these before running
const channelId = 'CHANNEL ID';
const googleFormUrl = 'ENTER FORM URL WHICH HAS APPSCRIPT';


const testBot = new DiscordBot(process.env.DISCORD_BOT_TOKEN);
testBot.start();
testBot.sendFile('source.gif', channelId);
testBot.sendGoogleForm(googleFormUrl, channelId);
testBot.listenForGoogleFormSubmissions(3002, (answers) => {
  console.log(answers);
});