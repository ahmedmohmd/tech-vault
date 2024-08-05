import { Injectable, NestMiddleware } from "@nestjs/common";
import { InjectMetric } from "@willsoto/nestjs-prometheus";
import { NextFunction, Request, Response } from "express";
import * as client from "prom-client";

// @Injectable()
// export class MetricsMiddleware implements NestMiddleware {
//   private requestCounter: client.Counter;

//   constructor() {
//     this.requestCounter = new client.Counter({
//       name: "http_requests_total",
//       help: "Total number of HTTP requests",
//       labelNames: ["method", "route", "status_code"],
//     });

//     client.register.registerMetric(this.requestCounter);
//   }

//   use(req: Request, res: Response, next: NextFunction) {
//     res.on("finish", () => {
//       this.requestCounter.inc({
//         method: req.method,
//         route: req.route?.path || req.path,
//         status_code: res.statusCode.toString(),
//       });
//     });

//     next();
//   }
// }

@Injectable()
export class CustomMetricsMiddleware implements NestMiddleware {
	public customDurationGauge: client.Gauge<string>;
	public customErrorsCounter: client.Counter<string>;

	constructor(
		@InjectMetric("count") public appCounter: client.Counter<string>,
		@InjectMetric("gauge") public appGauge: client.Gauge<string>
	) {
		this.customDurationGauge = new client.Gauge<string>({
			name: "app_duration_metrics",
			help: "app_concurrent_metrics_help",
			labelNames: ["app_method", "app_origin", "le"],
		});
		this.customErrorsCounter = new client.Counter<string>({
			name: "app_error_metrics",
			help: "app_usage_metrics_to_detect_errors",
			labelNames: ["app_method", "app_origin", "app_status"],
		});
	}

	use(req: Request, res: Response, next: NextFunction) {
		this.appCounter.labels(req.method, req.originalUrl).inc();
		this.appGauge.inc();

		const startTime = Date.now();

		res.on("finish", () => {
			const endTime = Date.now();
			const duration = endTime - startTime;
			this.customDurationGauge
				.labels(req.method, req.originalUrl, (duration / 1000).toString())
				.set(duration);

			this.customErrorsCounter
				.labels(req.method, req.originalUrl, res.statusCode.toString())
				.inc();
		});

		next();
	}
}
