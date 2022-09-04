const client = require('../index');
const Discord = require('discord.js');
const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment, ButtonInteraction, Client, Modal, TextInputComponent, ModalSubmitInteraction, ModalSubmitFieldsResolver } = require("discord.js");
const ee = require("../config/embed.json")
const em = require("../config/emojis.json")
const DB = require('../db/SuggestDB')
const db = require("quick.db")


client.on('interactionCreate', async interaction => {
  const userId = db.fetch(`userid_${interaction.guild.id}`)
  if (!interaction.isButton()) return;


  const { guildId, customId, message, member } = interaction

  DB.findOne({ Guild: guildId, MessageID: message.id },
    async (err, data) => {
      if (interaction.customId === 'sug-acc') {
        if (!member.permissions.has("MANAGE_GUILD")) return interaction.reply({ content: `${em.fail} You can't use this button`, ephemeral: true })

        if (!data) return interaction.reply({ content: `${em.fail} Sorry, couldn't find any data`, ephemeral: true })

        const Embed = message.embeds[0]

        if (!Embed) return

        Embed.fields[2] = { name: "Status", value: "Accepted", inline: true }
        const ARow = new MessageActionRow().addComponents(

          new MessageButton()
            .setCustomId("sug-accepted")
            .setStyle("SUCCESS")
            .setLabel("ACCEPTED")
            .setDisabled(true),

          new MessageButton()
            .setCustomId("sug-decline")
            .setStyle("SECONDARY")
            .setLabel("DECLINE")
            .setDisabled(true),
          new MessageButton()
            .setCustomId("sug-thread")
            .setStyle("SECONDARY")
            .setLabel("Create Thread")
            .setDisabled(true),
          new MessageButton()
            .setCustomId('sug-update')
            .setStyle('PRIMARY')
            .setLabel('UPDATE')
            .setDisabled(true)


        )

        message.edit({ embeds: [Embed.setColor("GREEN")], components: [ARow] })

        await data.delete()

        interaction.reply({ content: `${em.success} Suggestion Accepted`, ephemeral: true })
      }
      if (interaction.customId === 'sug-dec') {

        if (!member.permissions.has("MANAGE_GUILD")) return interaction.reply({ content: `${em.fail} You can't use this button`, ephemeral: true })

        if (!data) return interaction.reply({ content: `${em.fail} Sorry, couldn't find any data`, ephemeral: true })

        const Embed = message.embeds[0]

        if (!Embed) return

        Embed.fields[2] = { name: "Status", value: "Declined", inline: true }
        const DRow = new MessageActionRow().addComponents(

          new MessageButton()
            .setCustomId("sug-accept")
            .setStyle("SECONDARY")
            .setLabel("ACCEPT")
            .setDisabled(true),

          new MessageButton()
            .setCustomId("sug-declined")
            .setStyle("DANGER")
            .setLabel("DECLINED")
            .setDisabled(true),
          new MessageButton()
            .setCustomId("sug-threaded")
            .setStyle("SECONDARY")
            .setLabel("Create Thread")
            .setDisabled(true),
          new MessageButton()
            .setCustomId('sug-upd')
            .setStyle('PRIMARY')
            .setLabel('UPDATE')
            .setDisabled(true)

        )

        message.edit({ embeds: [Embed.setColor("RED")], components: [DRow] })

        await data.delete()


      }
      if (interaction.customId === 'sug-thr') {
        if (!member.permissions.has("MANAGE_GUILD")) return interaction.reply({ content: `${em.fail} You can't use this button`, ephemeral: true })

        if (!data) return interaction.reply({ content: `${em.fail} Sorry, couldn't find any data`, ephemeral: true })
        await message.startThread({
          name: 'This Suggestion Thread',
          autoArchiveDuration: 'MAX',
          reason: 'Suggestion thread',
        })
        interaction.reply({ content: `${em.success} thread created`, ephemeral: true })
      }

      if (interaction.customId === 'sug-up') {

        if (!userId === interaction.user.id) return;









      }

    }


  )

}
)


