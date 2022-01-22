import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notifications.entity';
import { NotificationsQueueProducer } from './notifications.producer';
import { NotificationsQueueConsumer } from './notifications.consumer';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    BullModule.registerQueue({
      name: 'notification_queue',
    }),
  ],
  providers: [NotificationsQueueConsumer, NotificationsQueueProducer],
  exports: [NotificationsQueueProducer]
})
export class NotificationsModule {}
