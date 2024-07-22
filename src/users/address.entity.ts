import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../users/user.entity";

@Entity({
  name: "addresses",
})
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  postCode: string;

  @Column()
  country: string;

  @Column({
    default: true,
  })
  isPrimary: boolean;

  @ManyToOne(() => User, (user) => user.addresses, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  user: User;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updatedAt: Date;
}
