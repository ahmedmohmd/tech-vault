import { Category } from 'src/categories/category.entity';
import { OrderItem } from 'src/orders/order-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';

@Entity({
  name: 'products',
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

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  category: Category;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product, {
    cascade: true,
  })
  items: OrderItem[];

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
