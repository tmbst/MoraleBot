const database = require("./dbClient");

module.exports = {
	// [Utility] Get a specific collection from MongoDB
	getCollection(colName) {
		const db = database.getMongoClient().db();
		return db.collection(colName);
	},
	// [Read] Finds any guild id in the database if it exists.
	async readGuildId(guildID) {
		const col = this.getCollection("guildMembers");
		const doc = await col.findOne({ guildID: guildID });

		return doc ? doc.guildID : null;
	},
	// Create a guild member into the Database
	async createGuildMember(guildData, userData) {
		const col = this.getCollection("guildMembers");

		let guildMemberDocument = {
			guildID: guildData.id,
			guildName: guildData.name,
			guildMemberID: userData.id,
			guildMemberName: userData.username,
			guildMemberBalance: 0,
			guildMemberDailyClaimed: new Date(0),
		};

		await col.insertOne(guildMemberDocument);
	},
	// Delete a guild member from the Database
	async deleteGuildMember(guildDataID, userDataID) {
		const col = this.getCollection("guildMembers");
		const doc = await col.findOne({
			guildID: guildDataID,
			guildMemberID: userDataID,
		});
		const name = doc.guildMemberName;

		await col.deleteOne({
			guildID: guildDataID,
			guildMemberID: userDataID,
		});

		return name;
	},
	// Check for any guild members that joined or retired while the bot was offline
	async readMemberValidation(guildMembers, request) {
		const mongoGuildMemberIds = [];
		const col = this.getCollection("guildMembers");
		const cursor = col.find({});

		await cursor.forEach((doc) => mongoGuildMemberIds.push(doc.guildMemberID));

		let difference;

		if (request === "retired") {
			difference = mongoGuildMemberIds.filter((id) => {
				return !guildMembers.has(id);
			});
		} else if (request === "new") {
			difference = guildMembers.filter((member) => {
				return !mongoGuildMemberIds.includes(member.id);
			});
		}

		return difference;
	},
	// Read the last daily claimed of a guild member.
	async readLastDailyClaimed(guildID, userID) {
		const col = this.getCollection("guildMembers");
		const doc = await col.findOne({
			guildID: guildID,
			guildMemberID: userID,
		});

		return doc.guildMemberDailyClaimed;
	},
	// Update the last daily claimed of a guild member.
	async updateDailiesClaimed(guildID, userID, currDateTime) {
		const col = this.getCollection("guildMembers");

		await col.updateOne(
			{ guildID: guildID, guildMemberID: userID },
			{ $set: { guildMemberDailyClaimed: currDateTime } }
		);
	},
	// Read the balance of a guild member.
	async readBalance(guildID, userID) {
		const col = this.getCollection("guildMembers");
		const doc = await col.findOne({
			guildID: guildID,
			guildMemberID: userID,
		});

		return doc.guildMemberBalance;
	},
	// Update the balance of a guild member.
	async updateBalance(guildID, userID, amount) {
		const col = this.getCollection("guildMembers");

		const currBalance = await this.readBalance(guildID, userID);
		const updatedBalance = currBalance + parseInt(amount);

		await col.updateOne(
			{ guildID: guildID, guildMemberID: userID },
			{ $set: { guildMemberBalance: updatedBalance } }
		);
	},
};
