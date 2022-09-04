const {
    Client,
    CommandInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Message,
    MessageSelectMenu,
} = require("discord.js");
const pollSchema = require(`${process.cwd()}/db/Poll.js`);
module.exports = {   
    name: "poll",
    description: "voting system",
    type: "CHAT_INPUT",
    options: [
        {
            name: "question",
            description: "poll question",
            type: "STRING",
            required: true,
        },
        {
            name: "whether-the-question",
            description: "Options are only yes / no",
            type: "BOOLEAN",
            required: true,
        },
        {
            name: "options",
            description: "Use ^ to separate options",
            type: "STRING",
            required: false,
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
  run: async (client, interaction, args) => {
        let members;
        if (
            interaction.guild.members.cache.size ===
            interaction.guild.memberCount
        )
            members = interaction.guild.members.cache.filter(
                (member) => !member.user.bot
            ).size;
        else
            members = (await interaction.guild.members.fetch()).filter(
                (member) => !member.user.bot
            ).size;
        if (!interaction.member.permissions.has("MANAGE_GUILD"))
        return interaction.followUp({
                content: `🔒 You do not have permission to use this command！`,
                ephemeral: true,
            });
        const question = interaction.options.getString("question");
        const truefalse = interaction.options.getBoolean("whether-the-question");
        const options = interaction.options.getString("options");
        const tag = interaction.options.getString("note");
        // const pic = interaction.options.getAttachment("picture");
        // if(pic && !pic.contentType.includes("image")) return interaction.reply(":x: The file you gave is not a picture!!")
        let controlRow = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId("control")
                .setPlaceholder("Initiator action")
                .addOptions([
                    {
                        label: "public voting results",
                        description: "Make voting results visible to all members",
                        value: "visible",
                        emoji: "987607934269784085",
                    },
                    {
                        label: "close vote",
                        description: "After voting is terminated, you will no longer be able to vote",
                        value: "end",
                        emoji: "987917220174774292",
                    },
                ])
        );
        if (truefalse === true) {
            let embed = new MessageEmbed()
                .setAuthor({ name: "📖 | Vote" })
                .setTitle(question)
                .setDescription(`Total votes: 0 / ${members} | Participation Rate: 0.00%`)
                .setFooter({
                    text: `${interaction.user.username} initiated a vote`,
                    iconURL: interaction.user.avatarURL({ dynamic: true }),
                })
                // .setImage(pic ? pic.proxyURL : null)
                .setColor("RANDOM");
            let messageRow = new MessageActionRow().addComponents(
                new MessageButton()
                    .setLabel("Yes")
                    .setStyle("SECONDARY")
                    .setCustomId("Option1"),
                new MessageButton()
                    .setLabel("No")
                    .setStyle("SECONDARY") 
                    .setCustomId("Option2"),
                new MessageButton()
                    .setLabel("View poll results")
                    .setStyle("PRIMARY")
                    .setEmoji("987607934269784085")
                    .setCustomId("showChart")
            );

            const sentMsg = await interaction.channel.send({
                content: tag ? tag : null,
                embeds: [embed],
                components: [messageRow, controlRow],
            });
            pollSchema({
                MessageID: sentMsg.id,
                OwnerID: interaction.user.id,
                Title: question,
                Options: ["Yes", "No"],
                Public: false,
                Ended: false,
            }).save();
        } else {
            if (options === null)
                return interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("<a:SK_cross:992382711480193055> | Please provide options")
                            .setColor("RED"),
                    ],
                    ephemeral: true,
                });
            let array = options.split("^");
            if (array.length > 10)
                return interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`<a:SK_cross:992382711480193055> | up to 10 options`)
                            .setColor("RED"),
                    ],
                    ephemeral: true,
                });
            let embed = new MessageEmbed()
                .setAuthor({ name: "📖 | vote" })
                .setTitle(question)
                .setDescription(`Total votes: 0 / ${members} | Participation Rate: 0.00%`)
                .setFooter({
                    text: `${interaction.user.username} initiated a vote`,
                    iconURL: interaction.user.avatarURL({ dynamic: true }),
                })
                .setColor("RANDOM");
            let array1 = [];
            let array2 = [];
            let array3 = [];
            array.forEach((value, index) => {
                if (index < 5) {
                    array1.push(value);
                }

                if (index <= 10 && index >= 5) {
                    array2.push(value);
                }
            });

            if (array1.length < 5 && array2.length === 0) {
                let messageRow = new MessageActionRow().addComponents(
                    array.map((value, i) => {
                        const button = new MessageButton()
                            .setLabel(`${value}`)
                            .setStyle("SECONDARY")
                            .setCustomId(`Option${i + 1}`);

                        return button;
                    }),
                    new MessageButton()
                        .setLabel("View poll results")
                        .setStyle("PRIMARY")
                        .setEmoji("987607934269784085")
                        .setCustomId("showChart")
                );
                const sentMsg = await interaction.channel.send({
                    embeds: [embed],
                    components: [messageRow, controlRow],
                });
                pollSchema({
                    MessageID: sentMsg.id,
                    OwnerID: interaction.user.id,
                    Title: question,
                    Options: array,
                    Public: false,
                    Ended: false,
                }).save();
            } else if (array1.length === 5 && array2.length === 0) {
                let messageRow = new MessageActionRow().addComponents(
                    array.map((value, i) => {
                        const button = new MessageButton()
                            .setLabel(`${value}`)
                            .setStyle("SECONDARY")
                            .setCustomId(`Option${i + 1}`);

                        return button;
                    })
                );
                let messageRow2 = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setLabel("View poll results")
                        .setStyle("PRIMARY")
                        .setEmoji("987607934269784085")
                        .setCustomId("showChart")
                );
                const sentMsg = await interaction.channel.send({
                    embeds: [embed],
                    components: [messageRow, messageRow2, controlRow],
                });
                pollSchema({
                    MessageID: sentMsg.id,
                    OwnerID: interaction.user.id,
                    Title: question,
                    Options: array,
                    Public: false,
                    Ended: false,
                }).save();
            } else if (array1.length === 5 && array2.length < 5) {
                let messageRow = new MessageActionRow().addComponents(
                    array1.map((value, i) => {
                        const button = new MessageButton()
                            .setLabel(`${value}`)
                            .setStyle("SECONDARY")
                            .setCustomId(`Option${i + 1}`);

                        return button;
                    })
                );
                let messageRow2 = new MessageActionRow().addComponents(
                    array2.map((value, i) => {
                        const button = new MessageButton()
                            .setLabel(`${value}`)
                            .setStyle("SECONDARY")
                            .setCustomId(`Option${i + 1 + 5}`);

                        return button;
                    }),
                    new MessageButton()
                        .setLabel("View poll results")
                        .setStyle("PRIMARY")
                        .setEmoji("987607934269784085")
                        .setCustomId("showChart")
                );
                const sentMsg = await interaction.channel.send({
                    embeds: [embed],
                    components: [messageRow, messageRow2, controlRow],
                });
                pollSchema({
                    MessageID: sentMsg.id,
                    OwnerID: interaction.user.id,
                    Title: question,
                    Options: array,
                    Public: false,
                    Ended: false,
                }).save();
            } else if (array1.length === 5 && array2.length === 5) {
                let messageRow = new MessageActionRow().addComponents(
                    array1.map((value, i) => {
                        const button = new MessageButton()
                            .setLabel(`${value}`)
                            .setStyle("SECONDARY")
                            .setCustomId(`Option${i + 1}`);

                        return button;
                    })
                );
                let messageRow2 = new MessageActionRow().addComponents(
                    array2.map((value, i) => {
                        const button = new MessageButton()
                            .setLabel(`${value}`)
                            .setStyle("SECONDARY")
                            .setCustomId(`Option${i + 1 + 5}`);

                        return button;
                    })
                );
                let messageRow3 = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setLabel("View poll results")
                        .setStyle("PRIMARY")
                        .setEmoji("987607934269784085")
                        .setCustomId("showChart")
                );

                const sentMsg = await interaction.channel.send({
                    embeds: [embed],
                    components: [
                        messageRow,
                        messageRow2,
                        messageRow3,
                        controlRow,
                    ],
                });
                pollSchema({
                    MessageID: sentMsg.id,
                    OwnerID: interaction.user.id,
                    Title: question,
                    Options: array,
                    Public: false,
                    Ended: false,
                }).save();
            }
        }

        interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription(
                        `<a:MarkChecking:992381788028669992> Poll successfully created`
                    )
                    .setColor("BLURPLE"),
            ],
            ephemeral: true,
        });
    },
};
