import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";

interface IDto {
	new (...args: any[]): object;
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
	constructor(private readonly dto: IDto) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map((data: any) =>
				plainToInstance(this.dto, data, {
					excludeExtraneousValues: true,
				})
			)
		);
	}
}
