## Example
Setup command listener and start
```js {highlightLines: [2]}
const bot = new ChatBotManager(botOptions);

bot.setupCommandListener(async (command, commandArgs, source) => {
    if (command === 'gm') {
      // group message
    } else if (command === 'ls') {
      // list all info
    } else if (command === 'pm') {
      // direct message
    }
});

bot.start(app);
```