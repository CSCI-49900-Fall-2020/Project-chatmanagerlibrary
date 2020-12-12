# Slash Commands (updating)

1. /ls (list: list all of the channels/members of slack/discord) 
    
    `/ls ${command_option} ${platform}`
    ```sh
    $ /ls channel discord
    $ /ls member discord
    $ /ls channel slack
    $ /ls member slack
    ``` 
   
2. /gm (group message: send messages to a group channel): 
    
    `/gm ${platform} ${channel_id} ${message}`  
     ```sh
     $ /gm discord ${channel_id} hello 
     $ /gm slack ${channel_id} hello
     ``` 
   
3. /pm (private message: send messages directly to a private person): 
    
    `/pm ${platform} ${user_id} ${message}`  
     ```sh
     $ /pm discord ${user_id} hello world 
     $ /pm slack ${user_id} hello world
     ```    