const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers
  ]
});

const CHANNEL_ID = '';
const embedLogFile = 'embed_log.json';
let sentMessageId = null;

const bots = [
  { name: "Bot 1", id: '1355937757683253298' },
  { name: "Bot 2", id: '1355936471932211210' },
  { name: "Bot 3", id: '1358565970851139786' },
  { name: "Bot 4", id: '1359231202074038445' },
  { name: "Bot 5", id: '1359221294767538297' }
];

function formatStatus(name, status) {
  const online = ['online', 'idle', 'dnd'].includes(status);
  const emoji = online ? '🟢' : '🔴';
  const message = online ? 'Online — Working Great' : 'Offline — Experiencing Issues';

  return {
    name: `${emoji} ${name}`,
    value: message,
    inline: true
  };
}

async function updateStatusEmbed() {
  const statuses = [];

  for (const bot of bots) {
    try {
      const user = await client.users.fetch(bot.id);
      const presence = await client.guilds.cache.first()?.members.fetch(bot.id);
      const status = presence?.presence?.status || 'offline';
      statuses.push(formatStatus(bot.name, status));
    } catch {
      statuses.push(formatStatus(bot.name, 'offline'));
    }
  }

  const embed = new EmbedBuilder()
    .setTitle("William's Bot Status")
    .setDescription("Current status of bots:")
    .setColor(0x842ABE)
    .addFields(statuses)
    .setTimestamp();

  const channel = await client.channels.fetch(CHANNEL_ID);
  if (!channel) return;

  if (sentMessageId) {
    try {
      const oldMsg = await channel.messages.fetch(sentMessageId);
      await oldMsg.edit({ embeds: [embed] });
    } catch {
      const newMsg = await channel.send({ embeds: [embed] });
      sentMessageId = newMsg.id;
      const embedData = { embedId: sentMessageId };
      fs.writeFileSync(embedLogFile, JSON.stringify(embedData, null, 2));
    }
  } else {
    const message = await channel.send({ embeds: [embed] });
    sentMessageId = message.id;
    const embedData = { embedId: sentMessageId };
    fs.writeFileSync(embedLogFile, JSON.stringify(embedData, null, 2));
  }
}

client.once('ready', () => {
  if (fs.existsSync(embedLogFile)) {
    const embedData = JSON.parse(fs.readFileSync(embedLogFile, 'utf8'));
    sentMessageId = embedData.embedId;
  }

  updateStatusEmbed();
  setInterval(updateStatusEmbed, 30 * 1000);
});

client.login(process.env.TOKEN);
