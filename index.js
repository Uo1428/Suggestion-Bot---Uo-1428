const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get(["/", "/:name"], (req, res) => {
  greeting = "<h1>Hello From Node on Fly!</h1>";
  name = req.params["name"];
  if (name) {
    res.send(greeting + "</br>and hello to " + name);
  } else {
    res.send(greeting);
  }
});

app.listen(port, () => console.log(`HelloNode app listening on port ${port}!`));


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
const prefix = config.prefix;
const token = config.token;
// Global Variables
client.voiceManager = new Collection();
client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.cooldowns = new Collection();
client.slashCommands = new Collection();
client.categories = fs.readdirSync("./commands/");

// Initializing the project
//Loading files, with the client variable like Command Handler, Event Handler, ...
["command"].forEach((handler) => {
  require(`./handler/${handler}`)(client);
});

client.login(config.token); 
