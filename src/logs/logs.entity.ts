import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Log {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public context: string;

  @Column()
  public message: string;

  @Column()
  public level: string;

  @CreateDateColumn({ name: 'created_at' })
  creationDate: Date;
}

export default Log;
