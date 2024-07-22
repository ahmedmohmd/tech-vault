import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity({
  name: "phone_numbers",
})
export class Phone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  phoneNumber: string;

  @Column({
    default: false,
  })
  isPrimary: boolean;

  @ManyToOne(() => User, (user) => user.emails, {
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
