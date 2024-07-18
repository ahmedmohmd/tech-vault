import { Transform } from 'class-transformer';
import { ColumnNumericTransformer } from 'src/common/transfomers/numiric.transformer';
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
import { User } from '../users/user.entity';
import { OrderStatus } from './enums/order-status.enum';

@Entity({
  name: 'orders',
})
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    enum: OrderStatus,
    default: OrderStatus.PLACED,
  })
  status: OrderStatus;

  @Column({
    default: 0,
  })
  total: number;
  // @Column({
  //   type: 'decimal',
  //   transformer: new ColumnNumericTransformer(),
  // })
  // @Transform(({ value }) => value.toString())
  // total: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
  })
  items: OrderItem[];

  @Column({ default: 0 })
  discount: number;
  // @Column({ type: 'decimal', default: 0 })
  // discount: number;
}
