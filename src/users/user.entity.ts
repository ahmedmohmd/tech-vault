import * as bcrypt from "bcrypt";

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
} from "typeorm";
import { Cart } from "../cart/cart.entity";
import { Notification } from "../notifications/notification.entity";
import { Order } from "../orders/order.entity";
import { Review } from "../reviews/review.entity";
import { Wishlist } from "../wishlist/wishlist.entity";
import { Address } from "./address.entity";
import { Email } from "./email.entity";
import { Role } from "./enums/user-role.enum";
import { Phone } from "./phone.entity";
import { UserImage } from "./user-image.entity";

@Entity({
  name: "users",
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => Email, (email) => email.user, {
    cascade: true,
  })
  emails: Email[];

  @Column()
  password: string;

  @OneToMany(() => Phone, (phone) => phone.user, {
    cascade: true,
  })
  phoneNumbers: Phone[];

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
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
    cascade: true,
  })
  @JoinColumn()
  userImage: UserImage;

  @OneToMany(() => Order, (order) => order.user, {
    cascade: true,
  })
  orders: Order[];

  @OneToMany(() => Address, (address) => address.user, {
    cascade: true,
  })
  addresses: Address[];

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
    type: "timestamp",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
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
