/*
    This class holds all the commands for Discord
*/ 
class DiscordCommands {
    constructor() {             
       
    }
    function setBotStatus(bot, status){
        bot.user.setStatus(status);
    }

    function sendMessageToUser(bot, id, message){
        bot.users.fetch(id)
        .then((user) => {
          user.send(message);
         })
        .catch(message => console.log((message)));
    }
    
  }

  module.exports = DiscordCommands;