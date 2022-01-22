import { Posts } from '../posts/posts.entity';
import { User } from '../users/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PrivateFile {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public key: string;

  @ManyToOne(() => Posts, (post: Posts) => post.images)
  public post: Posts;

  @ManyToOne(() => User, (user: User) => user.postimages)
  public user: User;
}
