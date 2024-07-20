import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../products/product.entity";
import { User } from "../users/user.entity";

@Entity({
  name: "reviews",
})
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column()
  comment: string;
  @ManyToOne(() => User, (user) => user.reviews, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  user: User;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  product: Product;
}
