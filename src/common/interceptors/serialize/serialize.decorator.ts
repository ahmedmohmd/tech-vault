import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { SerializeInterceptor } from './serialize.interceptor';

interface IDto {
  new (...args: any[]): {};
}

export const Serialize = (dto: IDto) =>
  UseInterceptors(new SerializeInterceptor(dto));
