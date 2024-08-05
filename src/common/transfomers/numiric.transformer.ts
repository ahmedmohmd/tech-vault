import { ValueTransformer } from "typeorm";

export class ColumnNumericTransformer implements ValueTransformer {
	to(value: number): number {
		return value;
	}

	from(value: string): string {
		return value;
	}
}
