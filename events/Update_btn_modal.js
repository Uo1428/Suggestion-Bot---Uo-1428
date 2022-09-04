const client = require('../index');
const Discord = require('discord.js');
const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment, ButtonInteraction, Client, Modal, TextInputComponent, ModalSubmitInteraction, ModalSubmitFieldsResolver } = require("discord.js");
const ee = require("../config/embed.json")
const em = require("../config/emojis.json")
const DB = require('../db/SuggestDB')
const db = require("quick.db")

client.on('interactionCreate', async interaction => {
  if (interaction.isButton()) {
    const userId = db.fetch(`userid_${interaction.guild.id}`)

    const { guildId, customId, message, member } = interaction


    DB.findOne({ Guild: guildId, MessageID: message.id },
      async (err, data) => {
        if (interaction.customId === 'sug-up') {
          if (interaction.user.id !== userId) return interaction.reply({ content: 'you only can update your own suggestion', ephemeral: true })
          const modal = new Modal()
            .setCustomId('sug-modal')
            .setTitle('Suggestion')

          const sugInput = new TextInputComponent()
            .setCustomId('suggestionInput')
            .setLabel("type your Suggestion hear")
            // Paragraph means multiple lines of text.
            .setStyle('PARAGRAPH')
            .setPlaceholder('type here')

            .setRequired(true)
          const sugActionRow = new MessageActionRow().addComponents(sugInput)
          modal.addComponents(sugActionRow)
          await interaction.showModal(modal)
        }
      })
  }
  else if (interaction.isModalSubmit) {
    if (interaction.customId === 'sug-modal') {
      // const userId = db.fetch(`userid_${interaction.guild.id}`)
      const { guildId, customId, message, member } = interaction

      DB.findOne({ Guild: guildId, MessageID: message.id },
        async (err, data) => {

          const sug = interaction.fields.getTextInputValue('suggestionInput')
          const userId = db.fetch(`userid_${interaction.guild.id}`)

          const embed = new MessageEmbed()
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))

            .setColor(ee.color)
            .setTitle(`${em.dot} NEW SUGGESTION`)
            .addFields([
              { name: "Suggestion", value: `${sug}`, inline: false },
              { name: "Suggested By", value: `<@${userId}>`, inline: true },
              { name: "Status", value: "Pending", inline: true },
            ])
            .setFooter({ text: "Want to suggest something? type /suggest" })
          message.edit({ embeds: [embed] })
          return interaction.reply({ content: "suggestion updated", ephemeral: true })
        })
    }
  }
})