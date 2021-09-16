/*
	Event: ready
	Uses Database?: No
	Description: Emitted when the client becomes ready to start working.
*/

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`[LOGS] MoraleBot is ready! Logged in as ${client.user.tag}.`);
        client.user.setActivity('TMBST', { type: 'COMPETING' });
    },
}