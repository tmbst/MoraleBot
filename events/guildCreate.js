const database = require('../database/dbFunctions');

module.exports = {
    name: "guildCreate",

    execute(guildData, client, dbClient) {
        // Add each guild members data to the database
        guildData.members.fetch().then( guildMembers => {
            
            guildMembers.forEach( member =>

                database.createGuildMember(guildData, member.user, dbClient)
                
            );
        });
    }
}