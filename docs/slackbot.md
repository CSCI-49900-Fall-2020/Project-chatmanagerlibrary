# Slack Bot
1. click the link `api.slack.com/apps`, choose **Create New App**
<img src="https://user-images.githubusercontent.com/47549128/96356655-d992b300-10bf-11eb-880d-2d3305e23a36.png" width="400">

<img src="https://user-images.githubusercontent.com/47549128/96356919-fbda0000-10c2-11eb-820e-f87dcb9d9844.png" width="400">

2. click **App Home**, and then click **Review Scopes to Add**
<img src="https://user-images.githubusercontent.com/47549128/96356957-51aea800-10c3-11eb-9762-b596c92bc5a4.png" width="400">

3. You could add the OAuth Acopes as you like, but for our chatManager, we would do like the pic shows.
<img src="https://user-images.githubusercontent.com/47549128/96356977-920e2600-10c3-11eb-8b7a-da6008d59a26.png" width="400">

4. Now, if you click **OAuth & Permissions** on the left lists, you could see button **Install App to Workspace** is available to click now. So, click it.
<img src="https://user-images.githubusercontent.com/47549128/96357026-0a74e700-10c4-11eb-99e2-1957013c8158.png" width="400">

5. Click **Allow**
<img src="https://user-images.githubusercontent.com/47549128/96357189-76f0e580-10c6-11eb-8289-dd9af8011149.png" width="400">

6. Now, you just finished adding the bot to slack.

7. If you wanna add the bot to the general channel, click **general**
<img src="https://user-images.githubusercontent.com/47549128/96404552-33bb7300-11a9-11eb-8919-000b550f2301.png" width="400">

8. Type **@the_bot_you_wanna_add**, for example, **@test**, then send the message
<img src="https://user-images.githubusercontent.com/47549128/96405234-cf99ae80-11aa-11eb-900c-2887fcbd88c9.png" width="400">

9. Click **Invite to Channel**
<img src="https://user-images.githubusercontent.com/47549128/96404553-34540980-11a9-11eb-913b-ca2f9c27e194.png" width="400">

## How to setup slack slash commands
1. Click `https://ngrok.com/`, download ngrok

2. After finished downloading ngrok, you could do 
    ```sh
    $ngrok http 3030
    ```
3. Copy the http address follow the first **Forwarding**, which is in the format of http://blablabla.ngrok.io

4. Go to the app settings for **Slash Commands** `https://api.slack.com/apps/{appId}/Slash Commands`, click **Create New Command** 
<img src="https://user-images.githubusercontent.com/47549128/98397635-a348b380-202d-11eb-8745-907539150e7d.png" width="400">

5. Add the command name, Request URL, remember the ngrok address you copied in step 3? paste it under **Request URL**, remember to add `/slack-command`, so the Request URL would look like:
    `http://blahblahblah.ngrok.io/slack-command`
   Don't forget click **save**
<img src="https://user-images.githubusercontent.com/47549128/98397634-a348b380-202d-11eb-916d-fab9058411cc.png" width="400">

6. You could always add more commands here, but remember to use the same URL address.
<img src="https://user-images.githubusercontent.com/47549128/98397616-9deb6900-202d-11eb-8d78-d2a3b3105434.png" width="400">

