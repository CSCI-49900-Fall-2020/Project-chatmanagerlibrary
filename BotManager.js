const DiscordBot = require('./discordBot')
const SlackBot = require('./slackBot')
const TelegramBot = require('./telegramBot')

class BotManager {
    constructor(...options){
        if(options.length > 0){
            if(options[0].platform) {
                if(options[0].platform == "slack") {
                    if(options[0].token && options[0].signingSecret){
                        this.slackBot = new SlackBot(options[0].token, options[0].signingSecret)
                    } else {
                        throw "please provide appropriate credentials for slack {token, signingSecret}"
                    }
                } else if(options[0].platform == "discord"){
                    if(options[0].token){
                        this.discordBot = new DiscordBot(options[0].token);
                    } else {
                        throw "please provide appropriate credentials for discord {token}"
                    }
                } else if(options[0].platform == "telegram"){
                    if(options[0].token){
                        this.telegramBot = new TelegramBot(options[0].token);
                    } else {
                        throw "please provide appropriate credentials for telegram {token}"
                    }
                }
            } else {
                throw "please provide a platform {platform}"
            }
        } else {
            throw "please provide appropriate parameters"
        }
    }

    sync(...options){
        if(this.telegramBot){
            if(options.length > 0){
                if(options[0].context){
                    this.telegramBot.sync(options[0].context)
                } else {
                    throw "please provide appropriate parameters for telegram {context}"
                }
            } else {
                throw "please provide appropriate parameters for telegram {context}"
            }
        } else {
            throw "this method only applies to telegram"
        }
    }
    start(...options){
        if(this.slackBot){
            if(options.length > 0){
                if(options[0].eventsPort && options[0].messagesPort){
                    return this.slackBot.start(options[0].eventsPort, options[0].messagesPort)
                } else {
                    throw "please provide appropriate credentials for slack {eventsPort, messagesPort}"
                }
            } else {
                throw "please provide appropriate credentials for slack {eventsPort, messagesPort}"
            } 
        } else if(this.discordBot) {
            return this.discordBot.start()
        } else if(this.telegramBot){
            return this.telegramBot.start()
        }
    }

    expressMiddleware(...options){
        if(this.slackBot){
            if(options.length > 0){
                if(options[0].events) {
                   return this.slackBot.eventsExpressMiddleware(req,res,next)
                }
                if(options[0].forms){
                    return this.slackBot.interactiveMessagesExpressMiddleware(req,res,next)
                } 
                if(options[0].commands) {
                    return this.slackBot.getSlashCommandListener()
                } else {
                    throw "please choose an appropriate options for slack {events, forms, commands}"
                }
            } else{
                throw "please choose an appropriate options for slack {events, forms, commands}"
            }
        } else if(this.discordBot){
            if(options.length > 0){
                if(options[0].forms){
                    return this.discordBot.formsExpressMiddleware(req,res,next)
                } else {
                    throw "please choose an appropriate options for discord {forms}"
                }
            } else {
                throw "please choose an appropriate options for discord {forms}"  
            }
        }
    }

    sendMessageToAllChannels(...options) {
        if(options.length > 0){
            if (this.slackBot){
                if(options[0].message){
                    return this.slackBot.sendMessageToAllChannels(options[0].message)
                } else {
                    throw "please choose an appropriate options for slack {message}"
                }
            } else if(this.discordBot) {
                if(options[0].message){
                    return this.discordBot.sendMessageToAllChannels(options[0].message)
                } else {
                    throw "please choose an appropriate options for discord {message}"
                }
            }  else if(this.telegramBot){
                if(options[0].message){
                    return this.telegramBot.sendMessageToAllChannels(options[0].message)
                } else {
                    throw "please choose an appropriate options for telegram {message}"
                }
            }
        } else {
            throw "please choose an appropriate options {message}"
        }
    }

    sendMessageToChannel(...options) {
        if(options.length > 0){
            if (this.slackBot){
                if(options[0].message && options[0].channelId){
                    return this.slackBot.sendMessageToChannel(options[0].channelId, options[0].message)
                } else {
                    throw "please choose an appropriate options for slack {channelId, message}"
                }
            } else if(this.discordBot) {
                if(options[0].message && options[0].channelId){
                    return this.discordBot.sendMessageChannel(options[0].channelId, options[0].message)
                } else {
                    throw "please choose an appropriate options for discord {channelId, message}"
                }
            } 
        } else {
            throw "please choose an appropriate options {channelId, message}"
        }
    }

    getChannels() {
        if(this.slackBot) {
            return this.slackBot.getChannels()
        } else if(this.discordBot){
            return this.discordBot.getChannels()
        } else if(this.telegramBot){
            return this.telegramBot.getChannels()
        }
    }

    getMembers() {
        if(this.slackBot){
            return this.slackBot.getMembers()
        } else if(this.discordBot){
            return this.discordBot.getMembers()
        }
    }

    sendDirectMessage(...options){
        if(options.length > 0){
            if (this.slackBot){
                if(options[0].message && options[0].userId){
                    return this.slackBot.sendDirectMessage(options[0].userId, options[0].message)
                } else {
                    throw "please choose an appropriate options for slack {userId, message}"
                }
            } else if(this.discordBot) {
                if(options[0].message && options[0].userId){
                    return this.discordBot.sendDirectMessage(options[0].userId, options[0].message)
                } else {
                    throw "please choose an appropriate options for discord {userId, message}"
                }
            } 
        } else {
            throw "please choose an appropriate options {userId, message}"
        }
    }

    sendFile(...options){
        if(options.length > 0){
            if(this.slackBot){
                if(options[0].channelId && options[0].filePath){
                    return this.slackBot.sendFile(options[0].channelId, options[0].filePath)
                } else if(options[0].userId && options[0].filePath) {
                    return this.slackBot.sendFile(options[0].userId, options[0].filePath)
                } else {
                    throw "please choose an appropriate options for slack {channelId or userId, filePath}"
                }
            } else if(this.discordBot) {
                if(options[0].channelId && options[0].filePath){
                    return this.discordBot.sendFileToChannel(options[0].channelId, options[0].filePath)
                } else if(options[0].userId && options[0].filePath) {
                    return this.discordBot.sendFileToUser(options[0].userId, options[0].filePath)
                } else {
                    throw "please choose an appropriate options for discord {channelId or userId, filePath}"
                }
            } else if(this.telegramBot){
                if(options[0].filePath){
                    return this.telegramBot.sendFile(options[0].filePath)
                } else {
                    throw "please choose an appropriate options for telegram {filePath}"
                }
            }
        } else {
            throw "please choose an appropriate options {channelId or userId, filePath}"
        }
    }

    sendForm(...options){
        if(options.length > 0){
            if(this.slackBot){
                if(options[0].messageJson && options[0].modalJson && options[0].channelId  && options[0].actionId) {
                    return this.slackBot.sendForm(options[0].messageJson, options[0].modalJson, options[0].channelId, options[0].actionId)
                } else {
                    throw "please choose an appropriate options for slack {messageJson, modalJson, channelId, actionId}"
                }
            } else if(this.discordBot){
                if(options[0].url && options[0].channelId){
                    return this.discordBot.sendGoogleForm(options[0].url, options[0].channelId)
                } else {
                    throw "please choose an appropriate options for discrd {url, channelId}"
                }
            }
        } else {
            throw "please choose an appropriate options"
        }
    }

    listenToFormSubmissions(...options){
        if(this.slackBot){
            if(options.length > 0){
                if(options[0].modalCallbackId){
                    return this.slackBot.listenForFormSubmissions(options[0].modalCallbackId)
                } else {
                    throw "please choose an appropriate options for slack {modalCallbackId}"
                }
            }
        } else if(this.discordBot){
            return this.discordBot.listenForForms()
        }
    }

    addCustomCommand(...options){
        if(options.length > 0){
            if(this.slackBot){
                if(options[0].command){
                    return this.slackBot.addCustomCommand(options[0].command)
                } else {
                    throw "please choose an appropriate options for slack {command}"
                }
            } else if(this.discordBot){
                if(options[0].command){
                    return this.discordBot.addCustomCommand(options[0].command)
                }
            } else {
                throw "please choose an appropriate options for discord {command}"
            }
        }
    }

    stop(...options){
        if(this.slackBot){
            if(options.length > 0){
                if(options[0].eventsPort && options[0].messagesPort){
                    return this.slackBot.stop(options[0].eventsPort, options[0].messagesPort)
                } else {
                    throw "please choose an appropriate options for slack {eventsPort, messagesPort}"
                }
            } else {
                throw "please choose an appropriate options for slack {eventsPort, messagesPort}"
            }
        } else if(this.discordBot) {
            return this.discordBot.stop()
        } else if(this.telegramBot){
            return this.telegramBot.quit()
        }
    }
}

module.exports = BotManager