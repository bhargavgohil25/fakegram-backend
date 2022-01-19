import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Log from './logs.entity';
import CreateLogDto from './dto/createLog.dto';

@Injectable()
export default class LogsService {
  constructor(
    @InjectRepository(Log)
    private readonly logsRepository: Repository<Log>,
  ) {}

  async createLog(log: CreateLogDto): Promise<Log> {
    const newLog = await this.logsRepository.create(log);

    await this.logsRepository.save(newLog, {
      data: {
        isCreatingLogs: true,
      },
    });

    return newLog;
  }
}
