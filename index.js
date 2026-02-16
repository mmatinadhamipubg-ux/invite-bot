const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites
    ]
});

// ذخیره کاربرانی که دریافت کردند
const claimedUsers = new Set();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// اگر بخوای بعداً کامند اضافه کنی، می‌تونی این event رو پر کنی
client.on('interactionCreate', async interaction => {
    // الان هیچ کامندی نداریم، پس هیچ کاری انجام نمیده
});

client.login(TOKEN);
