module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`[MoraleBot] Ready! Logged in as ${client.user.tag}.`);
        client.user.setActivity('TMBST', { type: 'COMPETING' });
    },
}