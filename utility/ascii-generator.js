const figlet  = require("figlet");

const GenerateAscii = (content) => {
    return GenerateAsciiWithFont(content, 'Ghost');
};

const GenerateAsciiWithFont = (content, font) => {
	return figlet.textSync(content, font)
};

module.exports = {
	GenerateAscii,
    GenerateAsciiWithFont
};
