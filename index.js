const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const rest = new REST({ version: '10' }).setToken(TOKEN);

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    try {
        console.log('Clearing all slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: [] } // این خط همه کامندها رو پاک می‌کنه
        );

        console.log('All slash commands have been deleted.');
    } catch (error) {
        console.error(error);
    }
});

client.login(TOKEN);
