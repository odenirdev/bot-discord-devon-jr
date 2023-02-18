const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const dotenv = require("dotenv");

dotenv.config();
const { TOKEN } = process.env;

require("discord-reply");
const client = new Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
});
client.commands = new Collection();

const commandsPath = path.join(__dirname, "src", "commands");
const commandsFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandsFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.error(
      `Esse comando ${filePath} está com "data" ou "execute" ausentes`
    );
  }
}

client.once("ready", (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("messageCreate", (message) => {
  console.log(`Message from ${message.author.username}: ${message.content}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.error("Command is not found");
    return;
  }

  try {
    command.execute(interaction);
  } catch (error) {
    console.error(error);
  }
});

client.login(TOKEN);
