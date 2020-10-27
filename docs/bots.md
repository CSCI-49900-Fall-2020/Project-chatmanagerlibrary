# Discord
1. Open the link, using your account to sign in  `https://discord.com/developers/application`
2. Click **New Application**
<img src="https://user-images.githubusercontent.com/47549128/96323229-315eea80-0fea-11eb-9a0d-9e86b486c651.png" width="400">

3. Add a name for it and click **Create** button
<img src="https://user-images.githubusercontent.com/47549128/96323228-30c65400-0fea-11eb-95bc-b316a4e3749e.png" width="400">

4. After creating a new application, click the **Bot** button on the left list
<img src="https://user-images.githubusercontent.com/47549128/96323227-30c65400-0fea-11eb-890c-c85566c598a4.png" width="400">

5. **Add Bot**
<img src="https://user-images.githubusercontent.com/47549128/96323226-30c65400-0fea-11eb-8465-eb9e3f742740.png" width="400">

6. Click **Yes, do it!**
<img src="https://user-images.githubusercontent.com/47549128/96323225-302dbd80-0fea-11eb-943f-b6fa372ec111.png" width="400">

7. Click **OAuth2**, add **bot**, and allow bot permissions **Send Messages** and **View Channels**
<img src="https://user-images.githubusercontent.com/47549128/96397851-7032a300-1198-11eb-97b6-44495df22605.png" width="400">
<img src="https://user-images.githubusercontent.com/47549128/96397849-7032a300-1198-11eb-92d7-fb460d7b29d5.png" width="400">

8. Copy the url address in the middle of this page, and paste it in your browser. Then, add the bot to your server, and click **Continue**
<img src="https://user-images.githubusercontent.com/47549128/96398099-0797f600-1199-11eb-81c5-47e0aaceaa91.png" width="400">

9. Now, you just finished adding the bot to discord.

# Slack:
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

# How to setup slack event api
1. Click `https://ngrok.com/`, download ngrok

2. After finished downloading ngrok, you could do 
    ```sh
    $ngrok http 3030
    ```

3. Copy the http address follow the first **Forwarding**, which is in the format of http://blablabla.ngrok.io

4. Go to the app settings for **Event Subscriptions** `https://api.slack.com/apps/{appId}/event-subscriptions`, **Enable Event** and paste the ngrok address you just copied under **Request URL**, remember to add `/slack-event`, so the Request URL would look like:
    `http://blablabla.ngrok.io/slack-event`
<img src="https://user-images.githubusercontent.com/47549128/97238449-d7b3a880-17bf-11eb-846f-2c2a6080ebd1.png" width="400">

5. Click **Subscribe to bot events**, you could add message.channels and message.im
<img src="https://user-images.githubusercontent.com/47549128/97236401-712c8b80-17bb-11eb-8fd6-29334a72c108.png" width="400">

6. Remember to click **Save**

7. Click **reinstall** the app for the worksapce if asked.
