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

  // // @OneToOne(() => User, (user) => user.userImage) // One-to-one relation with User (inverse side)
  // // user: User; // No join column needed here (optional)

  // @OneToOne((type) => User, (User) => User.userImage, {
  //   onDelete: 'CASCADE',
  // })
  // user: User;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
