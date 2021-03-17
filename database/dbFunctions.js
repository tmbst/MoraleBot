const dbColName = 'guildMembers'

module.exports = {
    // Create a guild member into the Database
    async createGuildMember(guildData, userData, dbClient)  {
        
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
    // Delete a guild member from the Database
    async deleteGuildMember(guildData, userData, dbClient) {

        const db = dbClient.db();
        const col = db.collection(dbColName);

        await col.deleteOne({'guildID': guildData.id, 'guildMemberID': userData.id});
    },
    // TODO: Read the last daily claimed by a guild member
    async readLastDailyClaimed(guildID, userID, dbClient) {
        const db = dbClient.db();
        const col = db.collection(dbColName);

   
    },
    // Read the balance of the guild member
    async readBalance(guildID, userID, dbClient) {
        const db = dbClient.db();
        const col = db.collection(dbColName);
        const doc = await col.findOne({"guildID": guildID, "guildMemberID": userID});

        return doc.guildMemberBalance;
    }

}