import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import getLogLevels from './utils/getLogLevels';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';
import CustomLogger from './logs/customLogger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
  });
  app.setGlobalPrefix('api/v1');

  // Logger for SQL queries
  app.useLogger(app.get(CustomLogger));

  const configService = app.get(ConfigService);
  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  });

  await app.listen(3000);
}
bootstrap();
