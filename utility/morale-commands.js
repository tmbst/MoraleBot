const { SlashCommandBuilder } = require("@discordjs/builders");
const Commands = require("./commands.json");

const MoraleCommand = (val) => {
    cmd = new SlashCommandBuilder();
    cmd.setName(Commands[val].name);
    cmd.setDescription(Commands[val].desc);
    return cmd;
};

const MoraleIntCommand = (val) => {
    cmd = MoraleCommand(val);
    cmd.addIntegerOption((option) => 
        option.setName("int").setDescription(Commands[val].intDesc)
    );
    return cmd;
};

const MoraleStrCommand = (val) => {
    cmd = MoraleCommand(val);
    cmd.addStringOption((option) => 
        option.setName("input").setDescription(Commands[val].strDesc).setRequired(Commands[val].required)
    );
    return cmd;
};

const MoraleUserCommand = (val) => {
    cmd = MoraleCommand(val);
    cmd.addUserOption((option) => 
        option.setName("user").setDescription(Commands[val].userDesc)
    );
    return cmd;
};

module.exports = {
    MoraleCommand,
    MoraleIntCommand,
    MoraleStrCommand,
    MoraleUserCommand
}