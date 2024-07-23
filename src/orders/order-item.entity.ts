import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Order } from "../orders/order.entity";
import { Product } from "../products/product.entity";

@Entity({
  name: "order_items",
})
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  quantity: number;

  @Column()
  price: number;
  // @Column({
  //   type: 'decimal',
  //   transformer: new ColumnNumericTransformer(),
  // })
  // @Transform(({ value }) => value.toString())
  // price: number;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updatedAt: Date;

  @ManyToOne(() => Product, (product) => product.items, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  product: Product;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  order: Order;
}
