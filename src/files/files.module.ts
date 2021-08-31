import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { PrivateFile } from './private-file.entity';
import { PublicFile } from './public-file.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([PublicFile, PrivateFile])
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports:[FilesService]
})
export class FilesModule {}
