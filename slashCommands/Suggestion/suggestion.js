const { Client, MessageEmbed, CommandInteraction } = require("discord.js")
const SuggestionDB = require('../../db/Suggestion')
const em = require('../../config/emojis.json')
const ee = require("../../config/embed.json")

module.exports = {
  name: "suggestion",
  description: "Sets or resets the Suggestion Channel",
  userperm: ["MANAGE_GUILD"],
  botperm: ["MANAGE_CHANNELS"],
  ownerOnly: false,
  options: [
    {
      name: "set",
      description: "Sets the Suggestion channel",
      type: "SUB_COMMAND",
      options: [
        {
          name: "channel",
          description: "Select the channel",
          type: "CHANNEL",
          required: false
        }
      ]
    },
    {
      name: "reset",
      description: "Resets the Suggestion channel",
      type: "SUB_COMMAND",
    },
  ],
  run: async (client, interaction, args) => {

    const { options, user, channel, guild } = interaction

    switch (options.getSubcommand()) {

      case "set": {

        const channel = options.getChannel("channel") || channel

        SuggestionDB.findOne({ Guild: guild.id }, async (err, data) => {

          if (err) throw err

          if (data) {

            data.delete()

            data = new SuggestionDB({
              Guild: guild.id,
              Channel: channel.id
            })
            await data.save()

          } else {

            data = new SuggestionDB({
              Guild: guild.id,
              Channel: channel.id
            })
            await data.save()

          }

          return interaction.followUp({
            embeds: [
              new MessageEmbed()
                .setColor(ee.color)
                .setDescription(`${em.success} - ${channel} is now set as Suggestion Channel`)
            ]
          })

        })

      }
        break;

      case "reset": {

        SuggestionDB.findOne({ Guild: guild.id }, async (err, data) => {

          if (err) throw err

          if (data) {

            data.delete()

            return interaction.followUp({
              embeds: [
                new MessageEmbed()
                  .setColor(ee.color)
                  .setDescription(`${em.success} - Suggestion Channel has been reset to none`)

              ]
            })

          } else {

            return interaction.followUp({
              embeds: [
                new MessageEmbed()
                  .setColor(ee.color)
                  .setDescription(`${em.success} - Suggestion Channel has already been reset to none`)

              ]
            })

          }

        })

      }
        break;

    }

  }
}