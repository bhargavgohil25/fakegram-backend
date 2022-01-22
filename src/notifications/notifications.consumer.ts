import { Logger } from '@nestjs/common';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import NotificationDto from './dto/notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notifications.entity';
import { Repository } from 'typeorm';

@Processor('notification_queue')
export class NotificationsQueueConsumer {
  private readonly logger = new Logger(NotificationsQueueConsumer.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  @Process('add_notification')
  async addNotificationToDB(
    notification: Job<NotificationDto>,
  ): Promise<Notification> {
    this.logger.debug(notification.data);

    const newNotification = await this.notificationRepository.create(
      notification.data,
    );

    await this.notificationRepository.save(newNotification);

    this.logger.debug(`Added notification to DB with id: ${newNotification.id}`);

    return newNotification;
  }
}
