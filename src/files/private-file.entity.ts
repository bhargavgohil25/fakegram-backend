import { Posts } from '../posts/posts.entity';
import { User } from '../users/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PrivateFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  key: string;

  @ManyToOne(() => Posts, (post: Posts) => post.images)
  post: Posts;

  @ManyToOne(() => User, (user: User) => user.postimages)
  user: User;
}
