import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
	) {}

	use(req: Request, res: Response, next: NextFunction): void {
		const { method, originalUrl } = req;
		const start = Date.now();

		res.on("finish", () => {
			const { statusCode } = res;
			const duration = Date.now() - start;
			this.logger.info(
				`HTTP ${method} ${originalUrl} ${statusCode} ${duration}ms`
			);
		});

		next();
	}
}
