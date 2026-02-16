const { Client, GatewayIntentBits, SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID; // آیدی اپلیکیشن
const GUILD_ID = process.env.GUILD_ID; // آیدی سرورت

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites
    ]
});

let inviteCache = new Map();
let claimedUsers = new Set(); // کسایی که قبلاً گرفتن

// ثبت اسلش کامند
const commands = [
    new SlashCommandBuilder()
        .setName('reward')
        .setDescription('دریافت پاداش برای 3 دعوت')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );
        console.log('Slash command registered.');
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    client.guilds.cache.forEach(async (guild) => {
        const invites = await guild.invites.fetch();
        inviteCache.set(guild.id, invites);
    });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'reward') {

        const guild = interaction.guild;
        const member = interaction.member;

        if (claimedUsers.has(member.id)) {
            return interaction.reply({ content: "❌ شما قبلاً پاداش را دریافت کرده‌اید.", ephemeral: true });
        }

        const invites = await guild.invites.fetch();
        const userInvites = invites.filter(inv => inv.inviter && inv.inviter.id === member.id);
        const totalUses = userInvites.reduce((acc, inv) => acc + inv.uses, 0);

        if (totalUses >= 3) {
            try {
                await interaction.user.send("snowclient public version 0.4 made by gang paradise");
                claimedUsers.add(member.id);
                return interaction.reply({ content: "✅ پیام به دایرکت شما ارسال شد.", ephemeral: true });
            } catch (err) {
                return interaction.reply({ content: "❌ دایرکت شما بسته است.", ephemeral: true });
            }
        } else {
            return interaction.reply({ content: "❌ شما هنوز 3 دعوت کامل نکرده‌اید.", ephemeral: true });
        }
    }
});

client.login(TOKEN);
