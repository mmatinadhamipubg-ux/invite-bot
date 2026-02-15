const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites
    ]
});

const TOKEN = process.env.TOKEN;

let inviteCache = new Map();

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const guild = client.guilds.cache.first();
    const invites = await guild.invites.fetch();
    inviteCache.set(guild.id, invites);
});

client.on('guildMemberAdd', async (member) => {
    const guild = member.guild;

    const newInvites = await guild.invites.fetch();
    const oldInvites = inviteCache.get(guild.id);

    const invite = newInvites.find(i => oldInvites.get(i.code)?.uses < i.uses);
    inviteCache.set(guild.id, newInvites);

    if (!invite) return;

    if (invite.uses === 3) {
        try {
            await invite.inviter.send("snowclient public version 0.4 made by gang paradise");
        } catch (err) {
            console.log("Couldn't DM user.");
        }
    }
});

client.login(TOKEN);
