const { Client, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');
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
let statusData = { online: 0, offline: 0 };
let statusToggle = true;

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
  let onlineCount = 0;
  let offlineCount = 0;

  for (const bot of bots) {
    try {
      const user = await client.users.fetch(bot.id);
      const presence = await client.guilds.cache.first()?.members.fetch(bot.id);
      const status = presence?.presence?.status || 'offline';
      if (['online', 'idle', 'dnd'].includes(status)) onlineCount++;
      else offlineCount++;
      statuses.push(formatStatus(bot.name, status));
    } catch {
      offlineCount++;
      statuses.push(formatStatus(bot.name, 'offline'));
    }
  }

  statusData = { online: onlineCount, offline: offlineCount };

  const embed = new EmbedBuilder()
    .setTitle("William's Bot Status")
    .setDescription("Current status of bots developed by William:")
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
      fs.writeFileSync(embedLogFile, JSON.stringify({ embedId: sentMessageId }, null, 2));
    }
  } else {
    const message = await channel.send({ embeds: [embed] });
    sentMessageId = message.id;
    fs.writeFileSync(embedLogFile, JSON.stringify({ embedId: sentMessageId }, null, 2));
  }
}

function rotateBotStatus() {
  const text = statusToggle
    ? `${statusData.online} Bot${statusData.online !== 1 ? 's' : ''} Online`
    : `${statusData.offline} Bot${statusData.offline !== 1 ? 's' : ''} Offline`;
  client.user.setActivity(text, { type: ActivityType.Watching });
  statusToggle = !statusToggle;
}

client.once('ready', () => {
  if (fs.existsSync(embedLogFile)) {
    const embedData = JSON.parse(fs.readFileSync(embedLogFile, 'utf8'));
    sentMessageId = embedData.embedId;
  }

  updateStatusEmbed();
  setInterval(updateStatusEmbed, 30000); 
  setInterval(rotateBotStatus, 15000);
});

client.login(process.env.TOKEN);
