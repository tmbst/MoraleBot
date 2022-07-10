const { MongoClient } = require("mongodb");
const { mongoURI } = require("../config.json");
const { logger } = require('../utility/logger.js');

let mongoClient;

module.exports = {
	async run() {
		mongoClient = new MongoClient(mongoURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		try {
			// Connect to the MongoDB cluster
			await mongoClient.connect();
			logger.info("Connected to MongoDB Servers.");
		} catch (error) {
			logger.error(error);

		}
	},

	getMongoClient() {
		return mongoClient;
	},
};
