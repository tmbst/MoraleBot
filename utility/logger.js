const { createLogger, format, transports } = require("winston");
const { splat, combine, timestamp, label, printf, simple } = format;

// TODO: figure out timestamp formatting
const logger = createLogger({
	format: combine(
		label({ label: "LOGS", message: true }),
		simple()
	),
	transports: [new transports.Console()],
});

// TODO: add multiple loggers for verbose logging

module.exports = {
	logger: logger,
};
