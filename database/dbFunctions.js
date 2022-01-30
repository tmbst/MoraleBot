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
			guildMemberDailyClaimed: 0,
		};

		await col.insertOne(guildMemberDocument);
	},
	// Retrieve guild member from Database
	async getGuildMember(guildID, guildMemberID) {
		const col = this.getCollection("guildMembers");
		return await col.findOne({
			guildID,
			guildMemberID,
		});
	},
	// Retrieve guild member, create user if it doesn't exist
	async getGuildMemberCreate(guildData, userData) {
		let user = await this.getGuildMember(guildData.id, userData.id);
		if (!user) {
			await this.createGuildMember(guildData, userData);
			user = await this.getGuildMember(guildData.id, userData.id);
		}

		return user;
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
	async readLastDailyClaimed(guildData, userData) {
		const user = await this.getGuildMemberCreate(guildData, userData);
		return user.guildMemberDailyClaimed;
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
	async readBalance(guildData, userData) {
		const user = await this.getGuildMemberCreate(guildData, userData);
		return user.guildMemberBalance;
	},
	// Update the balance of a guild member.
	async updateBalance(guildData, userData, amount) {
		const col = this.getCollection("guildMembers");

		const currBalance = await this.readBalance(guildData, userData);
		const updatedBalance = currBalance + parseInt(amount);

		await col.updateOne(
			{ guildID: guildData.id, guildMemberID: userData.id },
			{ $set: { guildMemberBalance: updatedBalance } }
		);
	},
};
