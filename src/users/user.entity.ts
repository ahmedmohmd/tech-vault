import * as bcrypt from 'bcrypt';
import { BcryptService } from 'src/bcrypt/bcrypt.service';

import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserImage } from './user-image.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({
    nullable: true,
  })
  lastName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    default: false,
  })
  verified: boolean;

  @Column({
    nullable: true,
    default: null,
  })
  verificationToken: string;

  @Column({
    nullable: true,
    default: null,
  })
  resetToken: string;

  @Column({
    nullable: true,
    default: null,
  })
  resetTokenExpirationDate: Date;

  // @OneToOne(() => UserImage, (userImage) => userImage.user, { nullable: true }) // One-to-one relation with UserImage
  // @JoinColumn({ name: 'userImageId' }) // Join column on User table
  // userImage: UserImage;

  // @OneToOne((type) => UserImage, (UserImage) => UserImage.user)
  // @JoinColumn()
  // userImage: UserImage;

  @OneToOne((type) => UserImage)
  @JoinColumn()
  userImage: UserImage;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    if (this.password && this.password.length < 60) {
      const hashSalt = 10;
      this.password = await bcrypt.hash(this.password, hashSalt);
    }
  }
}
