import * as path from "path";
import { format } from "winston";
import * as DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, errors } = format;

const logFormat = printf(
	({ level, message, timestamp, stack }) =>
		`${timestamp} ${level}: ${stack || message}`
);

export const fileTransport = new DailyRotateFile({
	filename: path.join(__dirname, "..", "..", "..", "logs/logs-%DATE%.log"),
	datePattern: "YYYY-MM-DD",
	level: "info",
	format: combine(timestamp(), errors({ stack: true }), logFormat),
});
