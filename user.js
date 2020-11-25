class User {
    constructor(id, name, platform, platform) {
        this.id = id;
        this.name = name;
        this.platform = platform;
        this.avatatar = platform;
       
    }
    getUserData(){
        const data = {
            id: this.id,
            name: this.name,
            platform: this.platform,
            avatar: this.avatatar,

        }

        return data;
    }
    
  }

  module.exports = User;