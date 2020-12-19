# project-chatmanager


## Table of Contents

* [Abstract](#Abstract)
* [Introduction](#Introduction)
* [Main](#Content)
* [Conclusion and Further Work](#Conclusion and Further Work)



## Abstract

  

The existence of API libraries that overlap in functions pose development issues among any developer that attempts to create cross-platform products. This may lead to higher development costs that resources would have to be deployed on what is functionally the same work. Our library integrates the API libraries of the most popular enterprise instant messaging services, Slack, Discord, and Telegram. To develop applications that will integrate with these platforms, developers will only need to learn our language.

  

## Introduction

  

Various Enterprise Instant Messaging platforms have sprung up with the wide-spread usage of the internet as an organizational tool within the workplace. Instantaneous communication and sharing of files allows workplace collaboration to scale up in an economic and cost effective way. Collaborators can work together, organize, critique and edit each other's work in real-time, allowing feedback for the workflow. There is a large, competitive environment when it comes to messaging platforms within workplaces. Companies compete to offer convenient and reliable service for their enterprise users; they offer features that make collaboration easy and extensible. These companies offer their APIs freely to clients and developers, hoping that the creation of platform-specific apps would lead to a large install base. Client-made apps offer the benefit of keeping customers using the platform while also enticing potential users to adopt said platform.

  

Maintaining a large ecosystem of apps is beneficial to any company that seeks to establish itself as a competitive player in enterprise software. This does, however, create issues for the end user. Within a workplace, it is not unusual for work groups to use different collaboration tools for different purposes. One platform might be used for technical support while another might be used within a development team while another for meetings with management. Keeping track of these different collaboration tools would add to the overhead of the workload for the individual team member. Furthermore, any internally developed apps for company use would be platform specific; to have one app available to two platforms would require the usage of different API libraries, each with their specific requirements and limitations. Companies would essentially be doing double the work, writing the same software twice. An organization could have a tech support ticketing system active on one platform while not available on another. This could lead to a situation where if a worker wanted to forward the details of the support ticket to a manager only available on a different platform, then there would be a breakdown of communication and an interruption of the workflow.

  

What we have managed to complete is one API that allows cross communication between three large platforms. We solve the issue of working with diverse implementations by having one library that gives developers access to API calls from the major instant messenger platforms. We achieved this by creating a method of initializing platform bots that have access to their respective API commands and resources. Users only need to supply platform specific credentials like tokens and signing secrets. We’ve set up a common interface for sending bot commands to allow cross-platform interaction. This allows users to send messages to channels and specific users across platforms, as well as files and interactive forms. Users are also able to get information regarding the servers and channels they are currently using. Along with the API library, we’ve also created a proof of concept backend service that demonstrates how our library would work. Developers are also free to use our backend service to deploy working bots.

  

## Main Content

  

### Recap

The presence of multiple instant messaging and collaboration platforms leads to a fragmented environment within workplaces. Enterprises must contend and manage multiple API libraries if they want to manage workflow across these different platforms. This will lead to high development costs, fractured communication tools, and an investment of man hours towards re-implementing the same service.

  

At the moment, there are more or less a dozen chat services in the market that offer similar functionalities like private messaging; listening for messages; group channels; group messaging; file exchange and more. The most popular ones are Discord, Slack, and Telegram. Each of these platforms have their own APIs, many with vastly different implementations. If an enterprise would want to cater to the users of these platforms, their developer would have to learn all of these individual APIs. And, if the enterprise wishes to cut down on the development stage, then he would have to hire multiple developers to learn and abstract desired functionalities from these different APIs. In the current environment, there is a lot of hassle and difficulty involved in both financial and development aspects in the production of a competitive enterprise application that would harness the functionalities provided by chat services and chatbot providers. These difficulties would grow as more and more workers rely on this fragmented ecosystem to perform their work.

  

### The Idea

The idea we have for this project is to create one library that has access to the major and common API calls across the more popular collaboration platforms. Developers would only need to interact with one API that would handle authentication, initialization, requests and API calls. We worked on porting API calls for each platform within one common library. Developers can then use and reference this library when developing and designing their interaction apps.

  

What is unique about our work is the attempt to bring these diverse development environments under one API library while accounting for the ways the platform libraries were implemented. This was challenging as there was not always a one-to-one corresponding API call for common methods. An example is the fact that the Slack development environment uses 5 unique API libraries for it’s developers, many of which have overlapping methods. We had to take into account these differences in design when writing our library.

  

### Technical Details

##### Wilmer Perez

We focused mainly on adding the most functionality for slack and Discord. They shared some functionalities in common which made it easier to integrate than telegram. After doing research we found out that the way that both telegram and teams work on a context based system so that made it harder to do some things which are inherently easier in slack and Discord. In Slack and Discord it is rather easy to start communication with a user who hasn’t started a conversation with you whereas in telegram in order to message a user they needed to have messaged you prior. In the case of Teams there is a proactive message feature that allows you to message a user but it requires many checks such as they must have also interacted with the bot or be in the same channel as the bot. The teams bot needs to retrieve the conversation with the user or information on the teams group therefore it’s much more involved that slack and Discord which only require a message and channel or user id to start a message. Additionally the both needed to be added to azure in order to be added to a group and had a limit of how many interactions it could do with users of a group depending on the pricing tier(this was limited to 10k/month on a free tier).

Amongst Slack and Discord there were some differences which we had to overcome. One such difference was the need for servers. In order to initialize slack bots we needed to use two separate ports since slack needed to make incoming connections for features such as command listeners, sending forms etc. On the other hand Discord didn't need servers. In order to overcome this we added server creation to the start method of our slack class. This way when we create a slack bot without a server we run start with the ports we need and if we are running a Discord bot we can run start to initialize our Discord bot and disregard any inputs since it doesn't need any.  Additionally, we also created wrappers around slack's middleware so in case the developer would like to use express. In this case the developer wouldn't need to call start on the slackbot instance.

Lastly, all of our methods for the bot wrapper class (BotManager) use ES6 rest parameters. This way the developers can pass the parameters they need in any order they way using a dictionary. This way it is easier to expand our library since we can just add a check to see what type of bot, our BotManager is running, then we can check if the appropriate parameters were sent by just checking if the parameter key exists in the dictionary pass. Overall we thought this would be a good solution to handle input in the case the bots don't share the same inputs. Additionally, if we keep expanding our library we wouldn't have to edit prior code or just have to do minimal updates in order to accommodate new bots.



##### Xiaoxia Zhang

The techstack we used is nodejs, express, and feathersjs, which is popular and widely used. Feathersjs is a framework built on the top of express which makes our life easier when creating and implementing any REST APIs.

We not only built  a library, but also included a backend service that allows the developer to host the service if they don't have their own or would like to see our API in action. They could also use the library (which is a submodule of our main project repo) if they prefer to integrate the service into their own node app. We provided the documentation for library integration, backend service deployment, code example and all source code for that.

The backend service is nothing but an express node app with redis(in-memory database) to store some user session information and it uses the chatbotmanager library. Essentially it has all these third-party chat bot app wrappers with an abstract class exposed to the developer so the developer doesn't need to worry about looking up the document for any third-party chat app.

The reason why it’s called the main interface chatbotmanager is that it behaves as a postman delivering the message for the end user between all these third-party bots. For example, user A on chat app X would like to send message to user B on chat app Y. User A would send a command with a message to bot U on chat app X, bot U would then forward the message to the backend service. On the backend, chatbotmanager is listening to all these bots’ in-coming message and commands. So it would receive the command and message from bot U and route it to the user B through Bot V on chat app Y. Essentially, users on two different platforms would be able to carry out a conversation by “impersonating” bots active on their platforms.

Below is a simple form of the communication and how it works.

<img src="https://user-images.githubusercontent.com/47549128/102671392-8db2c780-415d-11eb-9f36-986ab922a7de.png" width="600">

Slack user would be user A in this case, and the user would send the command with message to slack bot. Since our backend subscribes to slack bot’s message and slash command event, the backend will receive the request with the command and message payload sent by the slack server. The chatbotmanager on the backend checks the command and message payload, then decides it should go to the Discord user, so it sends the message to that Discord user through Discord API.

Notice that slack user has to be a friend of slack bot and Discord user is a friend of Discord bot so these bots could know where they are and who they need to talk to.

Above is just the basics of how communication works in general. On top of that we also added redis, which is an in memory database to store the user session and provide the context of the user command. The context could be who is user A currently talking to, so next time when the user sends a message to user B, he/she doesn’t need to type the same command to send the message and could just type the message itself to the bot.

Below is the diagram of how it works with context and session based command. The idea is straight forward, we would like to store the user’s current context somewhere in the database. The reason we use redis is it’s fast, light, and very easy to use. It’s also No-SQL, which means you don't need to predefine the table or any PK/FK like you did in any relational database.

<img src="https://user-images.githubusercontent.com/47549128/102671544-9905f300-415d-11eb-8505-216f5ea0ee6f.png" width="600">
Most of the difficulties we had are coming from the third-party chat app API, since each of the bot and chat APIs works quite differently. It’s challenging to standardize the API or method and abstract them to a uniform interface. That’s why we only define a common class which is chatBotManger instead create a base class for each. 

The diagram below indicates how our library is architectured. It’s very straightforward and the developer only needs to take a look into the function in chatBotManager since chatBotManager class is the only interface exposed to the developer. It also has an event handler which the developer could subscribe and listen to. The chatBotmanager also talks to different third-party bots through their API. From the UML diagram, you could see that each third-party bot works quite differently. Telegram and Discord require the backend to be long polling-based to retrieve the events. The Slack API requires you create a webhook or endpoint to receive their event. We wrote the wrapper class/function for each of the third-party bots and all the functions have its individual unit test file.

<img src="https://user-images.githubusercontent.com/47549128/102671474-93101200-415d-11eb-94d6-bbf321f68988.png" width="600">

Besides the function, the chatbotmanager also requires the developer to provide the bot token and credentials in order to interact with all these third-party chat apps.

For security, we deploy the backend as https on heroku, and all the backend API is protected by the API key, the developer could choose to rotate the API key as they needed. And all these tokens and keys we tested in our project are retrieved through the environment variables instead of putting them in the github repo.


#### Alfred Garcia

As part of explaining the capabilities of our project to any potential users, we made sure to provide documentation of API methods. We have previously considered hosting a static page generated site using the Jeykll framework on GitHub. This was abandoned when we discovered a simpler way of generating API documentation and integrating into a simple static site. 

Our library was documented using JDoc 3 annotation. This provides a simple style with well defined features that provides a clear description of methods while taking advantage of tagging abilities. JDoc 3 allows us to define classes, objects, callback methods, return types, as well as identifying the parameters necessary for the function signature. The benefit of using these tags is that they also allow for a description of the items tagged. 

Instead of manually creating markdown documents explaining the API, we opted to use a tool called documentation.js. This npm package is a documentation generation system that is capable of rendering annotated Javascript code into html or markdown documents. While JSDoc 3 itself offers a rendering system, we opted to use documentation.js as it provides full support for ES6 Javascript as well as offering simple html outputs. 

With our documentation, all that was left was to render the markdown files as a static site. For this we opted to use Docute, a Javascript file that generates the static site on runtime, all that is required to hosting the primary web page. A single index file inlucing a navigation and sidebar option allows for a simple, stylish, and modern looking website that is easy to navigate and provides all relevant information. To render the markdown files, we only need to link them under the appropriate page element, and Docute will handle the rendering to the site. We would then be able to host the documentation site on GitHub using GitHub Pages. This is a convenient and straight forward method that allows easy updates to the site.

Originally, we had considered using the Jekyll framework to generate the static site. This was because GitHub Pages offers native support for hosting and rendering Jeykll sites. Once we found an alternative with Docute and documentation.js, It became apparent that the Jekyll framework involved too much unnecessary overhead, as well as not being convenient when updating. 



#### Alleene Lacaba

My task was to design a web app that will showcase the ease and hassle-free integration of our library into a real application. To create the front end interface, I explored on react.js and ejs. React.js turned out to be a better candidate because it is a very dynamic component-based user interface builder that manages its own state while ejs is more of a template based where it’s interfaces are stored in a public folder and not super responsive on data changes. For a dynamic app that sends and receives text, multi-media, and other files that needs to be displayed to the user immediately React.js became the perfect fit.

For the backend development, I employed the use of MongoDB and Express. Express handled the routing of all the post and get requests.  MongoDB served as storage for state of all the chat exchanges so it could be retrieved and data could be used to send from one platform to the other.

I also contributed on the initial development of Teams API that we hope to get integrated to the Chatmanager Library as well. Used microsoft bot builder SDK to code the bot and botframework emulator to test the functionalities of the bot.



#### Brian Chambers

After implementing support for Slack and Discord, we focussed on adding Telegram functionality using the Telegraf API. The Telegraf API, through a Telegraf Bot, allowed us to interact with Telegram chats as an entity outside the Telegram mobile and web apps and to implement most of the functionality we wanted.

Creating a bot was straightforward with the use of Telegram’s Botfather. From there, we focused on the functionality we could implement for Telegram. Unfortunately, Telegram doesn’t support accessing the members of its chats and the structure of its chats is different from Slack and Discord, this meant we were unable to implement the list members function as we did for Slack and Discord. Further, while Slack and Discord’s chat structure include servers and channels within these servers, Telegram’s structure only includes group chats. What this meant was that we were also unable to implement the functionality to list all channels as we did for Slack and Discord, as there were not multiple channels to be listed.

On a brighter note, however, implementing the functionality to send messages and files to and from Telegram was possible and thanks to our experience implementing these functionalities for Slack and Discord, it was relatively easy to do this after reading the Telegraf API and Telegram API documentation. What was interesting about providing support for Telegram was its file management. Slack and Discord allow for files to be sent as attachments regardless of their type. The Telegraf API, however, has individual functions depending on the type of file. There was one function to send videos, one to send photos, and one to send documents. We implemented each separately and then wrapped them in one function to allow for similarly seamless functionality as in Slack and Discord. 

## Conclusion and Further Work:

  

Chatmanager Library addresses the problem of high cost development, fractured communication tools and multiple EIM API. Therefore, we recommend our library if the enterprise aims to simplify workflow, achieve low cost of development, smooth and continuous communication tools among team members. However, Chatmanager library is limited to supporting web apps, command line abstraction and other applications that support javascript language. Additionally, we would like to extend bot functionally by supporting other platforms such as Microsoft Teams.


Reference:
https://www.udemy.com/share/101WGiBEoccl1XQ38=/
https://API.slack.com/methods
https://Discord.com/developers/docs/intro
https://docs.microsoft.com/en-us/graph/teams-concept-overview
https://feathersjs.com/
https://www.serverless.com/
https://slack.dev/node-slack-sdk/tutorials/local-development
https://slack.dev/node-slack-sdk/interactive-messages
https://github.com/slackAPI/node-slack-sdk
 https://www.npmjs.com/package/documentation 
 https://docute.org/guide/deployment#github-pages
 https://www.npmjs.com/package/@slack/events-API

***[Group Authored Section](https://github.com/CSCI-49900-Fall-2020/project-chatmanagerlibrary/wiki)***
