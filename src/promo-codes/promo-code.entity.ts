import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({
  name: "promo_codes",
})
export class PromoCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  code: string;

  @Column({
    default: 0,
  })
  discount: number;

  @Column({
    type: "timestamp",
  })
  expirationDate: Date;

  @Column()
  usageLimit: number;

  @Column({
    default: 0,
  })
  usageCount: number;

  @Column({
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updatedAt: Date;
}
