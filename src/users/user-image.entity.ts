import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({
  name: 'users_images',
})
export class UserImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({
    nullable: true,
    default: null,
  })
  imagePublicId: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
