import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './logs.entity';

@Injectable()
export default class LogsTaskService {
  private readonly logger = new Logger(LogsTaskService.name);

  constructor(
    @InjectRepository(Log)
    private readonly logsRepository: Repository<Log>,
  ) {}

  /**
   * Delete all the query logs from database after every 15 days
   */
  @Cron('0 0 */15 * *', {
    name: 'deleteLogs',
    timeZone: 'Asia/Kolkata',
  })
  async handleLogs() {
    try {
      this.logger.log('Cron job going to delete logs');

      await this.logsRepository.delete({});

      this.logger.log('Cron job finished/deleted all query logs from database');
    } catch (err) {
      this.logger.error(err);
    }
  }
}
