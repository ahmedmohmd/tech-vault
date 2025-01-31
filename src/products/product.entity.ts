import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { Category } from "../categories/category.entity";
import { OrderItem } from "../orders/order-item.entity";
import { Review } from "../reviews/review.entity";
import { Wishlist } from "../wishlist/wishlist.entity";
import { ProductImage } from "./product-image.entity";

@Entity({
	name: "products",
})
export class Product {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	description: string;

	@Column()
	price: number;

	@OneToMany(() => ProductImage, (productImage) => productImage.product)
	productScreenshots: ProductImage[];

	@OneToMany(() => Wishlist, (wishlist) => wishlist.user, {
		cascade: true,
	})
	wishlist: Wishlist[];

	@OneToMany(() => Review, (review) => review.product)
	reviews: Review[];

	@ManyToOne(() => Category, (category) => category.products, {
		onDelete: "SET NULL",
		onUpdate: "NO ACTION",
	})
	category: Category;

	@OneToMany(() => OrderItem, (orderItem) => orderItem.product, {
		cascade: true,
	})
	items: OrderItem[];

	@CreateDateColumn({
		type: "timestamp",
	})
	createdAt: Date;

	@UpdateDateColumn({
		type: "timestamp",
	})
	updatedAt: Date;
}
