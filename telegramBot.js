const fs = require('fs')
const axios = require('axios')
const request = require('request')
const { Telegraf } = require('telegraf')

class TelegramBot {
    constructor( teleToken ){

        //URLs for http requests
        this.baseURL = `https://api.telegram.org/bot${teleToken}/`
        this.updateURL = `${this.baseURL}getUpdates`

        this.bot = new Telegraf(teleToken);

        this.initialzied = false;
        
        // allows bot to obtain chat id to send messages and files
        this.bot.command('init', (ctx) =>{

            try{
                
                this.chatID = ctx.chat.id
                this.chatTitle = ctx.chat.title
                
                ctx.reply(`Bot Initialized for Chat: ${this.chatID}` )
                this.initialzied = true;

            } catch (err) {
                console.log('Bot Initialization Error. Unable to obtain Chat ID')
                ctx.reply('Bot Initialization Error. Unable to obtain Chat ID')
            }
            

        })

        this.bot.command('status', (ctx) =>{
            if(this.initialzied){
                ctx.reply(`Bot Initialized for Chat: ${this.chatID}`)
            } else { 
                ctx.reply('Bot uninitialized for this Chat. Run the /init command to initialize.')
            }
        })

        this.bot.command('help', (ctx) =>{
            const helpText = `You can control me by sending these commands:\n
                                \t/init - initialize bot\n
                                \t/status - check status of bot\n
                                \t/gm <platform> <message> - sends text message to chosen platform\n`

            ctx.reply(helpText)
        })

        this.bot.command('quit', (ctx) => {
            ctx.leaveChat()
        })
        
        this.bot.command('gm', async (ctx) => {
            if(this.initialzied) {

                if(this.onCommandReceived){
                    const input = ctx.message.text.slice(1).trim().split(' ');
                    const command = input.shift();
                    const commandArgs = input.join(' ');
                    const result = await this.onCommandReceived(command, commandArgs, 'telegram');
                    console.log(result);
                    return result;
                }
                
            } else {
                ctx.reply('Bot uninitialized. Run /init command to initialize.')
            }
        })
        
        this.bot.command('fs', async (ctx) => {
            if(this.initialzied)  {
                if(this.onCommandReceived){
                    const input = ctx.message.text.slice(1).trim().split(' ');
                    const command = input.shift();
                    const commandArgs = input.join(' ');
                    const result = await this.onCommandReceived(command, commandArgs, 'telegram');
                    console.log(result);
                    return result;
                }
            
                const fileURL = "http://i.imgur.com/5rOhtdL.png"
                this.sendFile(fileURL)
            } else {
                ctx.reply('Bot uninitialized. Run /init command to initialize.')
            }
        })

        this.bot.command('fs_r', async (ctx) =>{
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

        this.bot.use((ctx) => {
            this.chatID = ctx.chat.id
            this.chatTitle = ctx.chat.title
        })

    }

    setCommandListener(commandListener) {
        this.onCommandReceived = commandListener;
    }

    async getUpdates(){

        try{
            const update = await axios.get(this.updateURL);
            return update.data;  
        } catch(err){
            console.log(err)
        }
        
    }

    getChannels(){
        return {
            id: this.chatID,
            name: this.chatTitle
        }
    }

    async sendMessageToAllChannels(message){
        if(this.initialzied){
            const response = await axios.post( `${this.baseURL}sendMessage?chat_id=${this.chatID}&text=${encodeURIComponent(message)}` );
            if(response.status = 200){
                console.log('Message sent successfully')
            }
        } else {
            console.log('Chat Uninitialized. Run /init command in Telegram Client and try again.')
        }
    }

    async sendFileLocal(filePath){
        
        console.log(`${this.baseURL}sendPhoto`)

        if(this.initialzied){

            var photoURL = fileURL;
            var formData = {
                chat_id: this.chatID,
                photo: await request(photoURL)
            };

            console.log(photo)

            const response = await axios.post({
                url: JSON.stringify(`${this.fileURL}sendPhoto`),
                formData: formData
            });

            console.log(response)
        } else {
            console.log('Chat Uninitialized')
        }
    }

    async sendFileRemote(fileURL){
        if(this.initialzied){
            try{
                return this.bot.telegram.sendDocument(this.chatID, fileURL);
            } catch (err) {
                console.log(err)
            }
        } else {
            console.log('Chat Uninitialized')
        }
    }

    start(){
        try{
            this.bot.launch();
        } catch(err) {
            console.log(err)
        }
    }

    quit(){
        this.bot.quit()
    }
}

module.exports = TelegramBot;