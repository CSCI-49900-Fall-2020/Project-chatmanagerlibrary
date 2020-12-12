### API Reference

-   [constructor][1]
    -   [Parameters][2]
-   [start][3]
    -   [Parameters][4]
-   [setupCommandListener][5]
    -   [Parameters][6]
-   [sendMessageToAllChannels][7]
    -   [Parameters][8]
-   [sendMessageChannel][9]
    -   [Parameters][10]
-   [getChannels][11]
-   [getMembers][12]
-   [sendDirectMessage][13]
    -   [Parameters][14]
-   [stop][15]
-   [eventListenerCallback
    command, commandArgs, 'discord'][16]
    -   [Parameters][17]

## constructor

### Parameters

-   `option` **[Object][18]** The chatBotManager configuration option
    -   `option.slackBotConfig` **[Object][18]** slack bot configuration
        -   `option.slackBotConfig.signingSecret` **[string][19]** slack bot signing secret
    -   `option.discordBotConfig` **[Object][18]** discord bot configuration
        -   `option.discordBotConfig.token` **[string][19]** discord bot token

## start

Initialize the bot manager and start command listener service

### Parameters

-   `app` **[Object][18]** The express app object

Returns **[Array][20]&lt;[Promise][21]>** An promise object array for bot initialization

## setupCommandListener

Setup the command listener

### Parameters

-   `eventListener` **eventListenerCallback** function to handle the message event

## sendMessageToAllChannels

Send message to all channels at a specific platform

### Parameters

-   `data` **[Object][18]** The data that's sent to the platform
    -   `data.platform` **[string][19]** The chat app platform, eg. slack, discord, telegram
    -   `data.message` **[string][19]** The sending message

Returns **[Promise][21]** Promise of sending message to channel

## sendMessageChannel

Send message to a specific channel

### Parameters

-   `data` **[Object][18]** The data that's sent to the platform
    -   `data.platform` **[string][19]** The chat app platform, eg. slack, discord, telegram
    -   `data.channelId` **[string][19]** The channelId of the channel where the message is sent to
    -   `data.message` **[string][19]** The sending message

Returns **[Promise][21]** Promise of sending message to channel

## getChannels

Get all channels info include channel ids, channel names, and platform, return all the channels from multiple platforms

Returns **[Array][20]&lt;[Object][18]>** A channel object array

## getMembers

Get all members info include user ids, user names, and platform, return all the members from multiple platforms

Returns **[Array][20]&lt;[Object][18]>** An user object array

## sendDirectMessage

Send direct message to private member at a specific platform

### Parameters

-   `data` **[Object][18]** The data that's sent to the platform
    -   `data.platform` **[string][19]** The chat app platform, eg. slack, discord, telegram
    -   `data.userId` **[string][19]** The users' id
    -   `data.message` **[string][19]** The sending message

Returns **[Promise][21]** Promise of sending message to a private user

## stop

Stop the bot service

## eventListenerCallback
command, commandArgs, 'discord'

This callback type is called `eventListenerCallback` and is displayed as a global symbol.

Type: [Function][22]

### Parameters

-   `command` **[string][19]** The command
-   `commandArgs` **[Array][20]&lt;[string][19]>** The command arguments
-   `platform` **[string][19]** The chat app platform, eg. slack, discord, telegram

[1]: #constructor

[2]: #parameters

[3]: #start

[4]: #parameters-1

[5]: #setupcommandlistener

[6]: #parameters-2

[7]: #sendmessagetoallchannels

[8]: #parameters-3

[9]: #sendmessagechannel

[10]: #parameters-4

[11]: #getchannels

[12]: #getmembers

[13]: #senddirectmessage

[14]: #parameters-5

[15]: #stop

[16]: #eventlistenercallback-command-commandargs-discord

[17]: #parameters-6

[18]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[19]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[20]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[21]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[22]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function
