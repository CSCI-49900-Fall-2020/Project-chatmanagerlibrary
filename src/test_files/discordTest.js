const DiscordBot = require('../../discordBot.js')


var testBot = new DiscordBot(process.env.DISCORD_BOT_TOKEN);
testBot.start().then((status) => {
  console.log(status);
})
testBot.sendFile('source.gif','714930494126424227');
testBot.sendGoogleForm('https://forms.gle/Beyb8EuojwJwqXTw9', '714930494126424227');
testBot.listenForGoogleFormSubmissions(3002, (answers) => {
  console.log(answers);
});