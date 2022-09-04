const { Client, MessageEmbed, CommandInteraction, MessageActionRow, MessageButton } = require("discord.js")
const SuggestionDB = require('../../db/Suggestion')
const DB = require('../../db/SuggestDB')
const ee = require('../../config/embed.json')
const em = require('../../config/emojis.json')
const db = require("quick.db")
module.exports = {
  name: "suggest",
  description: "Suggest something",
  userperm: [],
  botperm: [],
  ownerOnly: false,

  options: [
    {
      name: "suggestion",
      description: "Provide the suggestion",
      type: "STRING",
      required: true
    }
  ],
  run: async (client, interaction, args) => {

    db.set(`userid_${interaction.guild.id}`, interaction.user.id)
    const { options, guild, channel, user } = interaction

    const suggestion = options.getString("suggestion")

    const channelData = await SuggestionDB.findOne({ Guild: guild.id }).catch(err => { })

    if (channelData) {

      const Channel = guild.channels.cache.get(channelData.Channel)

      if (!Channel) return Error(interaction, "Suggestion Channel is not yet")

      if (channel.id !== Channel.id) return Error(interaction, `${em.fail} You can only suggest in the Suggestion Channel`)

      const Embed = new MessageEmbed()
        .setColor(ee.color)
        .setTitle(`${em.dot} NEW SUGGESTION`)
        .addFields([
          { name: "Suggestion", value: `${suggestion}`, inline: false },
          { name: "Suggested By", value: `${user}`, inline: true },
          { name: "Status", value: "Pending", inline: true },
        ])
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: "Want to suggest something? type /suggest" })

      const Row = new MessageActionRow().addComponents(

        new MessageButton()
          .setCustomId("sug-acc")
          .setStyle("SECONDARY")
          .setLabel("ACCEPT"),

        new MessageButton()
          .setCustomId("sug-dec")
          .setStyle("SECONDARY")
          .setLabel("DECLINE"),
        new MessageButton()
          .setCustomId("sug-thr")
          .setStyle("SECONDARY")
          .setLabel("Create Thread"),
        new MessageButton()
          .setCustomId('sug-up')
          .setStyle('PRIMARY')
          .setLabel('UPDATE')

      )



      const M = await interaction.followUp({ embeds: [Embed], components: [Row], fetchReply: true })

      const Data = new DB({
        Guild: guild.id,
        MessageID: M.id,
        Details: [
          {
            MemberID: user.id,
            Suggestion: suggestion
          }
        ]

      })
      M.react(em.like)
      M.react(em.equal)
      M.react(em.dislike)


      await Data.save()

    } else return Error(interaction, `${em.fail} Suggestion Channel is not yet set`)
  }

}
function Error(interaction, description) {

  interaction.followUp({
    embeds: [
      new MessageEmbed()
        .setColor(ee.color)
        .setDescription(`${description}!`)
    ],
    ephemeral: true
  })

}
