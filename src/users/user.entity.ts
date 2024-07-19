import * as bcrypt from 'bcrypt';

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
import { Cart } from '../cart/cart.entity';
import { Notification } from '../notifications/notification.entity';
import { Order } from '../orders/order.entity';
import { Review } from '../reviews/review.entity';
import { Wishlist } from '../wishlist/wishlist.entity';
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

  @OneToMany(() => Review, (review) => review.user, {
    cascade: true,
  })
  reviews: Review[];

  @OneToMany(() => Notification, (notification) => notification.user, {
    cascade: true,
  })
  notifications: Notification[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user, {
    cascade: true,
  })
  wishlist: Wishlist[];

  @OneToMany(() => Cart, (cart) => cart.user, { cascade: true })
  carts: Cart[];

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
