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
            'guildMemberDailyClaimed' : new Date(0)
        }

        await col.insertOne(guildMemberDocument);
    },
    // Delete a guild member from the Database
    async deleteGuildMember(guildDataID, userDataID, dbClient) {

        const db = dbClient.db();
        const col = db.collection(dbColName);
        const doc = await col.findOne({"guildID": guildDataID, "guildMemberID": userDataID});
        const name = doc.guildMemberName;

        await col.deleteOne({'guildID': guildDataID, 'guildMemberID': userDataID});

        return name;
    },
    // Check for any guild members that joined while the bot was offline
    async checkNewbieGuildMembers(discordGuildMembers, dbClient) {
        const mongoGuildMembers = [];
        const db = dbClient.db();
        const col = db.collection(dbColName);
        const cursor = col.find({});
        await cursor.forEach(doc => mongoGuildMembers.push(doc.guildMemberID));

        const difference = discordGuildMembers.filter(x => !mongoGuildMembers.includes(x));

        return difference;
    },
    async checkRetiredGuildMembers(discordGuildMembers, dbClient) {
        const mongoGuildMembers = [];
        const db = dbClient.db();
        const col = db.collection(dbColName);
        const cursor = col.find({});
        await cursor.forEach(doc => mongoGuildMembers.push(doc.guildMemberID));

        const difference = mongoGuildMembers.filter(x => !discordGuildMembers.includes(x));

        return difference;
    },
    // Read the last daily claimed by a guild member
    async readLastDailyClaimed(guildID, userID, dbClient) {
        const db = dbClient.db();
        const col = db.collection(dbColName);
        const doc = await col.findOne({"guildID": guildID, "guildMemberID": userID});

        return doc.guildMemberDailyClaimed

    },
    // Read the balance of the guild member
    async readBalance(guildID, userID, dbClient) {
        const db = dbClient.db();
        const col = db.collection(dbColName);
        const doc = await col.findOne({"guildID": guildID, "guildMemberID": userID});

        return doc.guildMemberBalance;
    },
    // Update dailies claimed
    async updateDailiesClaimed(guildID, userID, currDateTime, dbClient) {
        const db = dbClient.db();
        const col = db.collection(dbColName);

        await col.updateOne({"guildID": guildID, "guildMemberID": userID}, {$set:{guildMemberDailyClaimed: currDateTime}});
    },
    // Update the balance of the guild member
    async updateBalance(guildID, userID, amount, dbClient) {
        const db = dbClient.db();
        const col = db.collection(dbColName);

        const currBalance = await this.readBalance(guildID, userID, dbClient);
        const updatedBalance = currBalance + parseInt(amount);

        await col.updateOne({"guildID": guildID, "guildMemberID": userID}, {$set:{guildMemberBalance: updatedBalance}});
    },
}