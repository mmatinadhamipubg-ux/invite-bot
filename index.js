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

// وقتی ربات آنلاین شد
client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    // برای هر سرور Invite ها رو ذخیره می‌کنیم
    client.guilds.cache.forEach(async (guild) => {
        try {
            const invites = await guild.invites.fetch();
            inviteCache.set(guild.id, invites);
        } catch (err) {
            console.log(`Couldn't fetch invites for guild ${guild.id}`, err);
        }
    });
});

// وقتی عضو جدید اضافه شد
client.on('guildMemberAdd', async (member) => {
    const guild = member.guild;

    try {
        const newInvites = await guild.invites.fetch();
        const oldInvites = inviteCache.get(guild.id) || new Map();
        inviteCache.set(guild.id, newInvites);

        const invite = newInvites.find(i => oldInvites.get(i.code)?.uses < i.uses);

        if (!invite || !invite.inviter) return; // اگر Invite یا Inviter موجود نبود کرش نکنه

        if (invite.uses >= 3) { // وقتی تعداد Invite به 3 رسید
            try {
                await invite.inviter.send("snowclient public version 0.4 made by gang paradise");
                console.log(`DM sent to ${invite.inviter.tag}`);
            } catch (err) {
                console.log("Couldn't DM user.", err);
            }
        }
    } catch (err) {
        console.log("Error fetching invites:", err);
    }
});

client.login(TOKEN);
