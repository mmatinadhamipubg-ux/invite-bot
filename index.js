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

// Users who already claimed (resets if bot restarts)
const claimedUsers = new Set();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    // الان هیچ کامندی ثبت نشده، ولی event نگه داشته شده برای آینده
    // اگر interaction شد، اینجا میشه منطق DM یا ۳ اینوایت اضافه کرد
    try {
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
                content: "You must have at least 3 successful invites.",
                ephemeral: true
            });
        }

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
});

client.login(TOKEN);
