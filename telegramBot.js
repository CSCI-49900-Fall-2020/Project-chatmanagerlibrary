const fs = require('fs')
const axios = require('axios')
const { Telegraf } = require('telegraf')

class TelegramBot {
    constructor( teleToken ){
        //URL for http requests
        this.baseURL = `https://api.telegram.org/bot${teleToken}/`
        
        this.bot = new Telegraf(teleToken);

        this.bot.command('gm', async (ctx) => {
            this.sync(ctx)

            if(this.onCommandReceived){
                const input = ctx.message.text.slice(1).trim().split(' ');
                const command = input.shift();
                const commandArgs = input.join(' ');
                const result = await this.onCommandReceived(command, commandArgs, 'telegram');
                console.log(result);
                return result;
            }
        })

        this.bot.command('help', (ctx) =>{
            const helpText = `You can control me by sending these commands:\n
                                \t/gm <platform> <message> - sends text message to chosen platform\n
                                \t/ls <platform> - lists members of all channels of chosen platform\n
                                \t/file <platform> - sends file to provided platform\n`

            ctx.reply(helpText)
        })

        this.bot.command('quit', (ctx) => {
            ctx.leaveChat()
        })
        
        //This listens for messages containing files and triggers the file sharing function if necessary
        this.bot.use( async (ctx) => {
            this.sync(ctx)

            const update = ctx.update.message;
            
            //Check if update object contains a photo, video or document file
            //Check if update object contains a caption and caption entities to see if there is a command
            if( (update.video || update.photo || update.document) && (update.caption && update.caption_entities) ){
                //check if file was captioned with a bot command
                if(update.caption_entities[0].type == "bot_command"){
                    const caption = update.caption
                    //filePath will be passed to onCommandReceived
                    const filePath;
                    if(update.video){
                        const file = update.video
                        const fileID = file.file_id

                        ctx.telegram.getFileLink(fileID).then(url => { 
                            axios({url, responseType: 'stream'}).then(response => {
                                return new Promise((resolve, reject) => {
                                    response.data.pipe(fs.createWriteStream(`${ctx.update.message.from.id}_${ctx.update.message.message_id}.mp4`))
                                        .on('finish', () => {console.log('Successful Video download')})
                                        .on('error', e => {console.log(e)})
                                });
                            })
                        })
                    } else if(update.photo){
                        const files = update.photo
                        const fileID = files[1].file_id
                        
                        ctx.telegram.getFileLink(fileID).then(url => { 
                            axios({url, responseType: 'stream'}).then(response => {
                                return new Promise((resolve, reject) => {
                                    response.data.pipe(fs.createWriteStream(`${ctx.update.message.from.id}_${ctx.update.message.message_id}.jpg`))
                                        .on('finish', () => {console.log('Successful Photo download')})
                                        .on('error', e => {console.log(e)})
                                });
                            })
                        })
                    } else if(update.document){
                        const file = update.document
                        const fileID = file.file_id

                        ctx.telegram.getFileLink(fileID).then(url => { 
                            axios({url, responseType: 'stream'}).then(response => {
                                return new Promise((resolve, reject) => {
                                    response.data.pipe(fs.createWriteStream(`${ctx.update.message.from.id}_${ctx.update.message.message_id}.pdf`))
                                        .on('finish', () => {console.log('Successful Document download')})
                                        .on('error', e => {console.log(e)})
                                });
                            })
                        })
                    }

                    if(this.onCommandReceived){
                        const input = caption.slice(1).trim().split(' ');
                        const command = input.shift();
                        const commandArgs = input.join(' ');
                        const result = await this.onCommandReceived(command, commandArgs, 'telegram');
                        console.log(result);
                        return result;
                    }
                } 
            }   
        })
    }

    //Syncs the bot with the current chat
    sync(ctx) {
        this.chatID = ctx.chat.id
        this.chatTitle = ctx.chat.title
    }

    setCommandListener(commandListener) {
        this.onCommandReceived = commandListener;
    }

    getChannels(){
        return {
            id: this.chatID,
            name: this.chatTitle
        }
    }

    async sendMessageToAllChannels(message){
        try{
            const response = await this.bot.telegram.sendMessage(this.chatID, message)
            return response
        } catch (err) {
            console.log(err)
        }
    }

    async sendFile(filePath){
        const response = await this.bot.telegram.sendDocument(this.chatID, filePath)
        return response
    }

    start(){
        return this.bot.launch();
    }

    quit(){
        this.bot.quit()
    }
}

module.exports = TelegramBot;