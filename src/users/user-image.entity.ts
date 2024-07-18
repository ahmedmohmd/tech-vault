import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
