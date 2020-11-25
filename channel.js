class Channel {
    constructor(id, guild, name, type) {
        this.id = id;
        this.guild = guild;
        this.name = name;
        this.type = type;
       
    }
    getChannelData(){
        const data = {
            id: this.id,
            guild: this.guild,
            name: this.name,
            type: this.type,

        }

        return data;
    }
    
  }

  module.exports = Channel;