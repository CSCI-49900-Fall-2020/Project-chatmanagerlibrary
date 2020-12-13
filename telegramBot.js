const fs = require('fs')
const axios = require('axios')
const request = require('request')
const { Telegraf } = require('telegraf')

class TelegramBot {
    constructor( teleToken ){

        //URLs for http requests
        this.baseURL = `https://api.telegram.org/bot${teleToken}/`
        
        this.bot = new Telegraf(teleToken);

        this.initialzied = false;

        this.bot.command('help', (ctx) =>{
            const helpText = `You can control me by sending these commands:\n
                                \t/gm <platform> <message> - sends text message to chosen platform\n
                                \t/ls <platform> - lists members of all channels of chosen platform\n
                                \t/file <platform> <file> - sends file to provided platform\n`

            ctx.reply(helpText)
        })

        this.bot.command('quit', (ctx) => {
            ctx.leaveChat()
        })
        
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
        
        this.bot.command('fs_l', async (ctx) => {
            this.sync()

            if(this.initialzied)  {
                if(this.onCommandReceived){
                    const input = ctx.message.text.slice(1).trim().split(' ');
                    const command = input.shift();
                    const commandArgs = input.join(' ');
                    const result = await this.onCommandReceived(command, commandArgs, 'telegram');
                    console.log(result);
                    return result;
                }
            
                const filePath = "test.jpeg"
                this.sendFileLocal(filePath)
            } else {
                ctx.reply('Bot uninitialized. Run /init command to initialize.')
            }
        })

        this.bot.command('fs_r', async (ctx) =>{
            this.sync()

            if(this.initialzied)  {
                if(this.onCommandReceived){
                    const input = ctx.message.text.slice(1).trim().split(' ');
                    const command = input.shift();
                    const commandArgs = input.join(' ');
                    const result = await this.onCommandReceived(command, commandArgs, 'telegram');
                    console.log(result);
                    return result;
                }
            
                const fileURL = 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png'
                this.sendFileRemote(fileURL)
            } else {
                ctx.reply('Bot uninitialized. Run /init command to initialize.')
            }
        })

        //This listens for messages containing files and triggers the file sharing function if necessary
        this.bot.use( async (ctx) => {
            this.sync(ctx)

            const update = ctx.update.message;
            
            console.log(JSON.stringify(update, null, 2))

            //Check if update object contains a photo, video or document file
            //Check if update object contains a caption and caption entities to see if there is a command
            if( (update.video || update.photo || update.document) && ((update.caption) && (update.caption_entities)) ){
                if(update.caption_entities.type === "bot_command"){
                    const caption = update.caption

                    if(this.onCommandReceived){
                        const input = caption.slice(1).trim().split(' ');
                        const command = input.shift();
                        const commandArgs = input.join(' ');
                        const result = await this.onCommandReceived(command, commandArgs, 'telegram');
                        console.log(result);
                        return result;
                    }

                    if(update.video){
                    console.log('VIDEO: ')
                    console.log(JSON.stringify(update, null, 2)) 
                    } else if(update.photo){
                    console.log('PHOTO: ')

                    const photo = update.photo
                    console.log(JSON.stringify(update, null, 2))
    
                    } else if(update.document){
                    console.log('DOCUMENT: ')
                    console.log(JSON.stringify(update, null, 2))
    
                    }
                }
            }   
        })

    }

    //Syncs the bot with the current chat
    sync(ctx) {
        this.chatID = ctx.chat.id
        this.chatTitle = ctx.chat.title
        this.initialzied = true;
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

    async sendFile(file){
        const response = await this.bot.telegram.sendDocument(this.chatID, file)
        return response
    }

    // async sendFileRemote(fileURL){
    //     if(this.initialzied){
    //         const response = await this.bot.telegram.sendDocument(this.chatID, fileURL);
    //         return response
    //     } else {
    //         console.log('Chat Uninitialized. Run the /init command in the Telegram Client to initialize')
    //     }
    // }

    start(){
        return this.bot.launch();
    }

    quit(){
        this.bot.quit()
    }
}

module.exports = TelegramBot;