/*
    This class holds all the commands for Discord
*/ 
class DiscordCommands {
    constructor() {             
       
    }
    function setBotStatus(bot, status){
        bot.user.setStatus(status);
    }
    
  }

  module.exports = DiscordCommands;