# project-chatmanager


**Title:** Chat Manager

**Date:** September 8, 2020

**Getting Started**
- Initialize submodule for chatManagerLibrary
`git submodule init`
`git submodule update`
- Go to library folder `cd Project-chatmanagerlibrary/`
- Install the dependencies for the library
`npm install`
- Go to backend folder `cd backend/`
- Install the dependencies
`npm install`
- Start the backend node server
`npm run dev`

**Deploy to Heroku**
- Log in to Container Registry (`heroku login` is required)
`heroku container:login`
- Make sure you're in the root path of the repo, Build the image and push to Container Registry
`heroku container:push web`
- Deploy 
`heroku container:release web`

**Creating a feathers service**
Use [feather-cli](https://github.com/feathersjs/cli) to create a web service

**Group Members:** 
- Alfred Garcia
- Wilmer Perez
- Alleene Lacaba
- Xiaoxia Zhang
- Brian Chambers

**Introduction:** The proliferation of collaborations tools among companies and organizations has facilitated large scale and convenient communications among workforces. Yet, with the adoption of such diverse products, organizations with wildly different needs don’t always have tools necessary to streamline workflow and development. Most Enterprise Instant Messaging platforms provide documentation through APIs that allow enterprise customers to create custom software and libraries tailor-made for their workplaces. While this provides a solution for optimizing workspace flow, APIs are specific to each platform, therefore when using multiple EIM platforms within a work environment, software would need to be rewritten. The purpose of this project is to create a library that will handle the interaction with two EIM platforms via a bot. Users will be able to send interactive messages, direct messages and files within workspace groups and teams using either messaging platform.

**List of Features and Description:**
- Group Messaging
  - This feature allows for the chat manager to send group messages across multiple forms.
- Direct messaging
  - This feature allows the chat manager to be able to directly message a user.
- Share Files (jpeg, png, text files)
  - This feature will allow the chat manager to send and receive files from users
- Interactive Forms
  - This feature will allow the chat manager to handle interactive forms.

**List of features we would like to have after we finish main functionality:**

- We would like to extend the chatbot impersonation functionality by giving the library users the ability to configure the commands executable by the users (slash commands).
- Add/Remove Member
  - add and remove members from groups and/or channels

**Test plan:**

In order to test our library (npm package) we will be creating a website written on the MEAN stack. With the website we will show all the functionalities of the library such as messaging, file sharing and interactive forms. The website will act as the backend through which the chat manager(person) will impersonate a bot and interact with the messaging platforms such as slack. Additionally, we would like to extend bot impersonation functionality once the core features of the library are added. We would test these functionalities through the website as well.

***[Group Authored Section](https://github.com/CSCI-49900-Fall-2020/project-chatmanagerlibrary/wiki)***

