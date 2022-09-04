const { Client, Message, MessageEmbed, Collection } = require("discord.js");
const colors = require("colors");
const fs = require("fs");
const client = new Client({
  messageCacheLifetime: 60,
  fetchAllMembers: false,
  messageCacheMaxSize: 10,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  shards: "auto",
  allowedMentions: {
    parse: ["roles", "users", "everyone"],
    repliedUser: true,
  },
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: 32767,
});
module.exports = client;

const config = require("./config/config.json");
const ee = require("./config/embed.json");

// Global Variables
client.voiceManager = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.cooldowns = new Collection();
client.slashCommands = new Collection();
client.commands = new Collection();

// Initializing the project
//Loading files, with the client variable like Command Handler, Event Handler, ...
["command"].forEach((handler) => {
  require(`./handler/${handler}`)(client);
});

client.login(process.env.token).catch((e) => { console.log((e.message).red.bold) })


const express = require('express');
const app = express();
const port = 8080;
app.all('/', (req, res) => {
  res.send(`Express Activated`);
  res.end();
});
app.listen(port, () => console.log(`Bot running on http://localhost:${port}`));