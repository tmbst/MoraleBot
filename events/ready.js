module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`[LOGS] MoraleBot is ready! Logged in as ${client.user.tag}.`);
        client.user.setActivity('TMBST', { type: 'COMPETING' });
    },
}