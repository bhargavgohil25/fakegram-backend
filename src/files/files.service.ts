import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicFile } from './public-file.entity';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(PublicFile)
    private publicFilesRepository: Repository<PublicFile>,
    private readonly configService: ConfigService,
  ) {}
  
  /**
   * @description uploads a file to the public bucket (avatar)
   * @param dataBuffer 
   * @param fileName 
  */

  async uploadPublicFile(dataBuffer: Buffer, fileName: string) : Promise<PublicFile> {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        ACL: 'public-read',
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${uuid()}-${fileName}`,
      })
      .promise();

    const newFile = this.publicFilesRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });

    await this.publicFilesRepository.save(newFile);

    return newFile;
  }


  /**
   * @description deletes a file from the public bucket (avatar)
   * @param fileId
  */
  async deletePublicFile(fileId : string) : Promise<void> {
    const file = await this.publicFilesRepository.findOne({id : fileId});
    const s3 = new S3();
    await s3.deleteObject({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: file.key,
    }).promise();

    await this.publicFilesRepository.delete(fileId);
  }
}
