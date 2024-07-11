import { UserDto } from '../../../users/dto/user.dto';
import { SerializeInterceptor } from './serialize.interceptor';

describe('SerializeInterceptor', () => {
  it('should be defined', () => {
    expect(new SerializeInterceptor(UserDto)).toBeDefined();
  });
});
