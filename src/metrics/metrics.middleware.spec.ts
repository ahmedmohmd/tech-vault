import { CustomMetricsMiddleware } from "./metrics.middleware";

describe("MetricsMiddleware", () => {
	it("should be defined", () => {
		expect(new CustomMetricsMiddleware({} as any, {} as any)).toBeDefined();
	});
});
