import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../users/user.entity";
import { CartItem } from "./cart-item.entity";

@Entity()
export class Cart {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.carts, {
		onDelete: "CASCADE",
		onUpdate: "NO ACTION",
	})
	user: User;

	@OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
	items: CartItem[];

	// @Column({
	//   type: 'decimal',
	//   transformer: new ColumnNumericTransformer(),
	// })
	// @Transform(({ value }) => value.toString())
	// discount: number;
	@Column({
		default: 0,
	})
	discount: number;
}
