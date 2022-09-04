const client = require("..");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const {
  ChartJSNodeCanvas,
  ChartConfiguration,
} = require("chartjs-node-canvas");
const { MessageAttachment, MessageEmbed } = require("discord.js");
const width = 800;
const height = 600;
const pollSchema = require(`${process.cwd()}/db/Poll.js`);
client.on("interactionCreate", async (interaction) => {
  const endedEmbed = new MessageEmbed()
    .setTitle("<a:SK_cross:992382711480193055> | Voting has been terminated")
    .setColor("RED")
    .setFooter({
      iconURL: client.user.avatarURL({ dynamic: true }),
      text: "Suggestion Bot ∙ Uo#1428",
    })

  if (interaction.isSelectMenu()) {
    const checkEnded = await pollSchema.findOne({ MessageID: interaction.message.id });
    let messageId = interaction.message.id;
    let data = await pollSchema.findOne({ MessageID: messageId });
    if (interaction.customId === "control") {
      const value = interaction.values[0];

      if (value === "visible") {

        if (interaction.user.id != data.OwnerID)
          return interaction.reply({
            embeds: [
              new MessageEmbed()
                .setTitle('<a:SK_cross:992382711480193055> | You are not the creator of the vote')
                .setFooter({
                  iconURL: client.user.avatarURL({ dynamic: true }),
                  text: "Suggestion Bot ∙ Uo#1428",
                })
                .setColor("RED")
            ],
            ephemeral: true
          })

        let newPublic = false;
        if (data.Public === false) newPublic = true;
        pollSchema.findOneAndUpdate(
          { MessageID: messageId },
          { $set: { Public: newPublic } },
          async (err, data) => {
            await data.save()
          }
        );
        let textPublic = "public";
        if (newPublic === false) textPublic = "Private"
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(`<a:MarkChecking:992381788028669992> | Voting is set to ${textPublic}`)
              .setFooter({
                iconURL: client.user.avatarURL({ dynamic: true }),
                text: "Suggestion Bot ∙ Uo#1428",
              })
              .setColor("GREEN")
          ], ephemeral: true
        })
      } if (value === "end") {

        if (interaction.user.id != data.OwnerID)
          return interaction.reply({
            embeds: [
              new MessageEmbed()
                .setTitle('<a:SK_cross:992382711480193055> | You are not the creator of the vote')
                .setFooter({
                  iconURL: client.user.avatarURL({ dynamic: true }),
                  text: "Suggestion Bot ∙ Uo#1428",
                })
                .setColor("RED")
            ],
            ephemeral: true
          })


        if (checkEnded.Ended === true) return interaction.reply({
          embeds: [endedEmbed],
          ephemeral: true
        })

        pollSchema.findOneAndUpdate({
          MessageID: interaction.message.id
        }, {
          $set: {
            Ended: true,
          }
        }, async (err, data) => {
          await data.save();
        })
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("<a:SK_cross:992382711480193055> | Voting has been terminated")
              .setColor("RED")
              .setFooter({
                iconURL: client.user.avatarURL({ dynamic: true }),
                text: "Suggestion Bot ∙ Uo#1428",
              })
          ], ephemeral: true
        })
      }
    }
  }


  if (interaction.type === "APPLICATION_COMMAND") return;
  if (interaction.isButton) {
    if (interaction.customId.startsWith("Option")) {
      let messageId = interaction.message.id;

      const checkEnded = await pollSchema.findOne({ MessageID: messageId });
      if (checkEnded.Ended === true) return interaction.reply({
        embeds: [endedEmbed],
        ephemeral: true
      })

      // PULL SCHEMA
      pollSchema.findOneAndUpdate(
        { MessageID: messageId },
        { $pull: { Option1: `<@${interaction.user.id}>` } },
        async (err, data) => {
          data.save();
        }
      );
      pollSchema.findOneAndUpdate(
        { MessageID: messageId },
        { $pull: { Option2: `<@${interaction.user.id}>` } },
        async (err, data) => {
          data.save();
        }
      );
      pollSchema.findOneAndUpdate(
        { MessageID: messageId },
        { $pull: { Option3: `<@${interaction.user.id}>` } },
        async (err, data) => {
          data.save();
        }
      );
      pollSchema.findOneAndUpdate(
        { MessageID: messageId },
        { $pull: { Option4: `<@${interaction.user.id}>` } },
        async (err, data) => {
          data.save();
        }
      );
      pollSchema.findOneAndUpdate(
        { MessageID: messageId },
        { $pull: { Option5: `<@${interaction.user.id}>` } },
        async (err, data) => {
          data.save();
        }
      );
      pollSchema.findOneAndUpdate(
        { MessageID: messageId },
        { $pull: { Option6: `<@${interaction.user.id}>` } },
        async (err, data) => {
          data.save();
        }
      );
      pollSchema.findOneAndUpdate(
        { MessageID: messageId },
        { $pull: { Option7: `<@${interaction.user.id}>` } },
        async (err, data) => {
          data.save();
        }
      );
      pollSchema.findOneAndUpdate(
        { MessageID: messageId },
        { $pull: { Option8: `<@${interaction.user.id}>` } },
        async (err, data) => {
          data.save();
        }
      );
      pollSchema.findOneAndUpdate(
        { MessageID: messageId },
        { $pull: { Option9: `<@${interaction.user.id}>` } },
        async (err, data) => {
          data.save();
        }
      );
      pollSchema.findOneAndUpdate(
        { MessageID: messageId },
        { $pull: { Option10: `<@${interaction.user.id}>` } },
        async (err, data) => {
          data.save();
        }
      );
      let option = interaction.customId;
      pollSchema.findOneAndUpdate(
        { MessageID: messageId },
        {
          $push: {
            [`${option}`]: `<@${interaction.user.id}>`,
          },
        },
        async (err, data) => {
          data.save();
        }
      );
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("<a:MarkChecking:992381788028669992> | voting is complete")
            .setDescription(
              `You voted \`${interaction.component.label}\``
            )
            .setColor("GREEN"),
        ],
        ephemeral: true,
      });

      await delay(200);

      const data = await pollSchema.findOne({
        MessageID: interaction.message.id,
      });

      let count =
        data.Option1.length +
        data.Option2.length +
        data.Option3.length +
        data.Option4.length +
        data.Option5.length +
        data.Option6.length +
        data.Option7.length +
        data.Option8.length +
        data.Option9.length +
        data.Option10.length;

      let members;
      if (interaction.guild.members.cache.size === interaction.guild.memberCount) members = interaction.guild.members.cache.filter(member => !member.user.bot).size;
      else members = (await interaction.guild.members.fetch()).filter(member => !member.user.bot).size;

      const user = client.users.cache.get(data.OwnerID);
      let embed = new MessageEmbed()
        .setAuthor({ name: "📖 | vote" })
        .setTitle(data.Title)
        .setDescription(
          `Total votes: ${count} / ${members} | Participation Rate: ${(
            (+count /
              +members) *
            100
          ).toFixed(1)}%`
        )
        .setFooter({
          text: `${user.username} initiated a vote`,
          iconURL: user.avatarURL({ dynamic: true }),
        })
        .setColor("RANDOM");

      interaction.message.edit({ embeds: [embed] });
    } else if (interaction.customId === "showChart") {
      const data = await pollSchema.findOne({
        MessageID: interaction.message.id,
      });
      if (data.Public != true && interaction.user.id != data.OwnerID)
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("<a:SK_cross:992382711480193055> | This poll is not public")
              .setDescription(
                "Only the originator can view the results，If you want to make it public, you can click the `public voting results`"
              )
              .setFooter({
                iconURL: client.user.avatarURL({ dynamic: true }),
                text: "Suggestion Bot ∙ Uo#1428",
              })
              .setColor("RED"),
          ],
          ephemeral: true,
        });
      const canvas = new ChartJSNodeCanvas({
        width,
        height,
        backgroundColour: "rgb(45 47 51)",
      });
      // canvas.registerFont(`${process.cwd()}/fonts/NotoSansTC-Regular.otf`, {
      //   family: "NotoSansTC",
      // });

      const configuration = {
        type: "pie",
        options: {
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 32,
                  family: "'Noto Sans TC', sans-serif",
                },
              },
            },
            labels: {
              render: "value",
              fontSize: 28,
              fontStyle: "bold",
              fontColor: "#FFF",
              fontFamily: '"Lucida Console", Monaco, monospace',
            },
          },
        },
        data: {
          labels: data.Options,
          datasets: [
            {
              label: "My First Dataset",
              data: [
                data.Option1.length,
                data.Option2.length,
                data.Option3.length,
                data.Option4.length,
                data.Option5.length,
                data.Option6.length,
                data.Option7.length,
                data.Option8.length,
                data.Option9.length,
                data.Option10.length,
              ],
              backgroundColor: [
                "#ED5565",
                "#FFCE54",
                "#48CFAD",
                "#5D9CEC",
                "#EC87CD",
                "#FC6E51",
                "#A0D468",
              ],
            },
          ],
        },
      };

      const image = await canvas.renderToBuffer(configuration);
      const attachment = new MessageAttachment(image);

      // Get number of how many people joined
      let count =
        +data.Option1.length +
        +data.Option2.length +
        +data.Option3.length +
        +data.Option4.length +
        +data.Option5.length +
        +data.Option6.length +
        +data.Option7.length +
        +data.Option8.length +
        +data.Option9.length +
        +data.Option10.length;
      const options = [];
      let fieldData = new Object();
      if (data.Option1.length != 0) {
        fieldData = {
          name: `${data.Options[0]} (common ${data.Option1.length} people ${(
            (+data.Option1.length / +count) *
            100
          ).toFixed(1)}%)`,
          value: `${data.Option1.join("\n")}`,
        };
        options.push(fieldData);
      }
      if (data.Option2.length != 0) {
        fieldData = {
          name: `${data.Options[1]} (common ${data.Option2.length} people ${(
            (+data.Option2.length / +count) *
            100
          ).toFixed(1)}%)`,
          value: `${data.Option2.join("\n")}`,
        };
        options.push(fieldData);
      }
      if (data.Option3.length != 0) {
        fieldData = {
          name: `${data.Options[2]} (common ${data.Option3.length} people ${(
            (+data.Option3.length / +count) *
            100
          ).toFixed(1)}%)`,
          value: `${data.Option3.join("\n")}`,
        };
        options.push(fieldData);
      }
      if (data.Option4.length != 0) {
        fieldData = {
          name: `${data.Options[3]} (common ${data.Option4.length} people ${(
            (+data.Option4.length / +count) *
            100
          ).toFixed(1)}%)`,
          value: `${data.Option4.join("\n")}`,
        };
        options.push(fieldData);
      }
      if (data.Option5.length != 0) {
        fieldData = {
          name: `${data.Options[4]} (common ${data.Option5.length} people ${(
            (+data.Option5.length / +count) *
            100
          ).toFixed(1)}%)`,
          value: `${data.Option5.join("\n")}`,
        };
        options.push(fieldData);
      }
      if (data.Option6.length != 0) {
        fieldData = {
          name: `${data.Options[5]} (common ${data.Option6.length} people ${(
            (+data.Option6.length / +count) *
            100
          ).toFixed(1)}%)`,
          value: `${data.Option6.join("\n")}`,
        };
        options.push(fieldData);
      }
      if (data.Option7.length != 0) {
        fieldData = {
          name: `${data.Options[6]} (common ${data.Option7.length} people ${(
            (+data.Option7.length / +count) *
            100
          ).toFixed(1)}%)`,
          value: `${data.Option7.join("\n")}`,
        };
        options.push(fieldData);
      }
      if (data.Option8.length != 0) {
        fieldData = {
          name: `${data.Options[7]} (common ${data.Option8.length} people ${(
            (+data.Option8.length / +count) *
            100
          ).toFixed(1)}%)`,
          value: `${data.Option8.join("\n")}`,
        };
        options.push(fieldData);
      }
      if (data.Option9.length != 0) {
        fieldData = {
          name: `${data.Options[8]} (common ${data.Option9.length} people ${(
            (+data.Option9.length / +count) *
            100
          ).toFixed(1)}%)`,
          value: `${data.Option9.join("\n")}`,
        };
        options.push(fieldData);
      }

      const statusEmbed = new MessageEmbed()
        .setTitle(data.Title)
        .addFields(options)
        .setColor("GREEN")
        .setImage("attachment://file.jpg");
      interaction.reply({
        embeds: [statusEmbed],
        files: [attachment],
        ephemeral: true,
      });
    }
  }
});