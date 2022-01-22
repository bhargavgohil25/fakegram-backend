import { FakeBaseEntity } from "src/commons/base.entity";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'triggered_by', nullable: false })
  public triggeredBy: string;

  @Column({ name: 'triggered_on', nullable: false })
  public triggeredOn: string;

  @Column()
  public postId: string;

  @Column({ name: 'notification_message' })
  public notificationMessage: string;

  @Column({ name: 'is_read', default: false })
  public isRead: boolean;

  @CreateDateColumn({ name: 'datetime_added' })
  public datetimeAdded: Date;
}


