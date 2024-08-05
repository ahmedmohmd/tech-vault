import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../products/product.entity";
import { Cart } from "./cart.entity";

@Entity()
export class CartItem {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Cart, (cart) => cart.items, {
		onDelete: "CASCADE",
		onUpdate: "NO ACTION",
	})
	cart: Cart;

	@ManyToOne(() => Product, (product) => product.id, {
		onDelete: "CASCADE",
		onUpdate: "NO ACTION",
	})
	product: Product;

	@Column("int")
	quantity: number;
}
