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
	name: "emails",
})
export class Email {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		unique: true,
	})
	email: string;

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
