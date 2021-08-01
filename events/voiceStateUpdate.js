module.exports = {
    name: 'voiceStateUpdate',

    execute(oldState, newState) {
        // If nobody has left the voice chat or if not the channel the bot is currently in
        if (oldState.channelID !== oldState.guild.me.voice.channelID || newState.channel) {
            return;
        }

        const numConnected = oldState.channel.members.size
    
        // Bot is the only one in voice
        if (numConnected == 1) {
            oldState.channel.leave();
            console.log('LOGS: Auto-disconnected from voice due to nobody else in the call.')
        }
    },
}