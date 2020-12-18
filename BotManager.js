const DiscordBot = require('./discordBot')
const { SlackBot } = require('./slackBot');

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
                }
            } else {
                throw "please provide a platform {platform}"
            }
        } else {
            throw "please provide appropriate parameters"
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
        }
    }
}

module.exports = BotManager

// test1 = new BotManager({platform: "discord", token: process.env.DISCORD_BOT_TOKEN});
// test2 = new BotManager({platform: "slack", token: process.env.SLACK_BOT_TOKEN, signingSecret: process.env.SLACK_SIGNING_SECRET})

// test1.start().then(() => {
//     test1.sendMessageToAllChannels({message: "sendMessageToAllChannels"})
//     test1.sendMessageToChannel({channelId: "789019543560912916", message: "testing"})
//     test1.getChannels().then(result => console.log(result))
//     test1.getMembers().then(result => console.log(result))
//     test1.sendDirectMessage({userId: "346039246366441472", message: "test"})
//     test1.sendFile({userId: "346039246366441472", filePath: "./src/test_files/source.gif"})   // send to user
//     test1.sendFile({channelId: "789019543560912916", filePath: "./src/test_files/source.gif"})  // send to channel
// })

// test2.start({eventsPort: 3000, messagesPort: 3001})
// test2.sendMessageToAllChannels({message: "test"})
// test2.sendMessageToChannel({channelId: "D01AADTNTLP", message: "testing"})
// test2.getChannels().then(result => console.log(result))
// test2.getMembers().then(result => console.log(result))
// test2.sendDirectMessage({userId: "U01AA5TPE75", message: "testing"})
// test2.sendFile({userId: "U01AA5TPE75", filePath: "./src/test_files/source.gif"}) // send to user
// test2.sendFile({channelId: "D01AADTNTLP", filePath: "./src/test_files/source.gif"}) // send to channel
