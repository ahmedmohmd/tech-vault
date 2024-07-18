import { Expose, Transform } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Transform(({ obj }) => obj.userImage?.url)
  @Expose()
  userImage: string;

  @Expose()
  verified: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
