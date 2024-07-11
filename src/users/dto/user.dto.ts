import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  userImage: any;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
