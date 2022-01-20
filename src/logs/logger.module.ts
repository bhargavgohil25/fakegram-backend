import { Module } from '@nestjs/common';
import CustomLogger from './customLogger';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './logs.entity';
import LogsService from './logs.service';
import LogsTaskService from './logs-task.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Log])],
  providers: [CustomLogger, LogsService, LogsTaskService],
  exports: [CustomLogger],
})
export class LoggerModule {}
