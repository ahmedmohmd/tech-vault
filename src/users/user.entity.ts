import * as bcrypt from 'bcrypt';
import { BcryptService } from 'src/bcrypt/bcrypt.service';

import { Order } from 'src/orders/order.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './enums/user-role.enum';
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

  @OneToOne(() => UserImage, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
    cascade: true,
  })
  @JoinColumn()
  userImage: UserImage;

  @OneToMany(() => Order, (order) => order.user, {
    cascade: true,
  })
  orders: Order[];

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  @Column({
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    if (this.password && this.password.length < 60) {
      const hashSalt = 10;
      this.password = await bcrypt.hash(this.password, hashSalt);
    }
  }
}
