const { Client, GatewayIntentBits, SlashCommandBuilder, Routes, REST } = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites
    ]
});

// Users who already claimed (resets if bot restarts)
const claimedUsers = new Set();

// Register the slash command
const commands = [
    new SlashCommandBuilder()
        .setName('snowclientbasic') // ← نام جدید کامند
        .setDescription('For claim SnowClient Basic with 3 invites')
        .toJSON()
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log('Registering slash command...');
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );
        console.log('Slash command registered.');
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'snowclientbasic') {

        const member = interaction.member;

        if (claimedUsers.has(member.id)) {
            return interaction.reply({
                content: "You have already claimed SnowClient Basic.",
                ephemeral: true
            });
        }

        const invites = await interaction.guild.invites.fetch();
        let inviteCount = 0;

        invites.forEach(invite => {
            if (invite.inviter && invite.inviter.id === member.id) {
                inviteCount += invite.uses;
            }
        });

        if (inviteCount < 3) {
            return interaction.reply({
                content: "You must have at least 3 successful invites to claim SnowClient Basic.",
                ephemeral: true
            });
        }

        try {
            await interaction.user.send("snowclient public version 0.4 made by gang paradise");
            claimedUsers.add(member.id);

            return interaction.reply({
                content: "SnowClient Basic has been sent to your DM.",
                ephemeral: true
            });

        } catch (err) {
            return interaction.reply({
                content: "I cannot send you a DM. Please enable Direct Messages.",
                ephemeral: true
            });
        }
    }
});

client.login(TOKEN);
