const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, MessageAttachment, MessageCollector, MessageSelectMenu } = require('discord.js');
const ee = require("../../config/embed.json")
const em = require("../../config/emojis.json")

module.exports = {
  name: '',
  description: '',
  userperm: [],
  botperm: [],
  ownerOnly: false,
  /*
    options: [
        {
          name: "",
          description: "",
          type: "",
          required: ,    
          }
    ],
    
     
      /** 
       * @param {Client} client 
       * @param {CommandInteraction} interaction 
       * @param {String[]} args 
       */
  run: async (client, interaction, args) => {



  }
}