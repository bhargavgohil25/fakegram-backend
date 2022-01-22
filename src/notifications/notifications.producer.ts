import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import NotificationDto from './dto/notification.dto';

@Injectable()
export class NotificationsQueueProducer {
  private readonly logger = new Logger(NotificationsQueueProducer.name);

  constructor(
    @InjectQueue('notification_queue') private notificationQueue: Queue,
  ) {}

  /**
   * Adding a new notification to the queue
   */
  async addNotificationToQueue(notification: NotificationDto): Promise<void> {
    try {
      console.log("notification -->", notification);
      const notificationJob = await this.notificationQueue.add(
        'add_notification',
        notification,
        {
          delay: 2000,
        },
      );

      this.logger.debug(
        `Added notification to queue with job id: ${notificationJob.id}`,
      );
    } catch (err) {
      this.logger.error('Error adding notification to queue', err);
      throw new BadRequestException(err);
    }
  }
}
