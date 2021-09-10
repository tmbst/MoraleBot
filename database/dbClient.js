const { MongoClient } = require('mongodb');
const { mongoURI } = require('../config.json');

let mongoClient;

module.exports = {

    async run() {

        mongoClient = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

        try {

            // Connect to the MongoDB cluster
            await mongoClient.connect();
            console.log("[MongoDB] Connected to MongoDB Servers.");
    
        } catch (error) {
            console.error(error);
        } 
    },

    getMongoClient() {
        return mongoClient
    }
}