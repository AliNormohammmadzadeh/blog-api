
import { User } from 'src/api/auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';


@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => User, user => user.posts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;  
}
