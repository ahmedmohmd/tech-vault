import { Expose, Transform } from "class-transformer";

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Transform(({ obj }) => obj.emails.map((email) => email.email))
  @Expose()
  emails: string[];

  @Transform(({ obj }) => obj.phoneNumbers?.map((phone) => phone.phoneNumber))
  @Expose()
  phoneNumbers: string[];

  @Expose()
  address: string;

  @Transform(({ obj }) => obj.userImage)
  @Expose()
  userImage: string;

  @Expose()
  verified: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
