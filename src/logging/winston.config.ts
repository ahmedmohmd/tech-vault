import { format } from "winston";
import { consoleTransport } from "./transports/console.transport";
import { fileTransport } from "./transports/file.transport";

const { combine, timestamp, printf, errors } = format;

const logFormat = printf(
	({ level, message, timestamp, stack }) =>
		`${timestamp} ${level}: ${stack || message}`
);
const winstonConfigs = {
	level: "info",
	format: combine(
		timestamp(),
		errors({ stack: true }), // log the full stack trace
		logFormat
	),
	transports: [consoleTransport, fileTransport],
};

export default winstonConfigs;
