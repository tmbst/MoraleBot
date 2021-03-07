const dbColName = 'guildMembers'

module.exports = {
    // Create a guild member into the Database
    async createGuildMember(guildData, userData, dbClient)  {
        
        // Connect to the moraleBotDB
        const db = dbClient.db();
        const col = db.collection(dbColName);

        let guildMemberDocument = {
            'guildID' : guildData.id,
            'guildName' : guildData.name,
            'guildMemberID' : userData.id,
            'guildMemberName' : userData.username,
            'guildMemberBalance' : 0,
            'guildMemberDailyClaimed' : Date.now()  // Figure out how to set timestamps in MongoDB, needs to be the beginning of time
        }

        await col.insertOne(guildMemberDocument);
    },

    async deleteGuildMember(guildData, userData, dbClient) {
        // Connect to the moraleBotDB
        const db = dbClient.db();
        const col = db.collection(dbColName);

        await col.deleteOne({'guildID': guildData.id, 'guildMemberID': userData.id});
    },

}