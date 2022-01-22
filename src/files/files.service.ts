import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicFile } from './public-file.entity';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';
import { PrivateFile } from './private-file.entity';
import { Posts } from '../posts/posts.entity';
import { User } from '../users/users.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(PublicFile)
    private publicFilesRepository: Repository<PublicFile>,
    @InjectRepository(PrivateFile)
    private privateFilesRepository: Repository<PrivateFile>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * @description uploads a file to the public bucket (avatar)
   * @param dataBuffer
   * @param fileName
   */

  async uploadPublicFile(
    dataBuffer: Buffer,
    fileName: string,
  ): Promise<PublicFile> {
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
  async deletePublicFile(fileId: string): Promise<void> {
    const file = await this.publicFilesRepository.findOne({ id: fileId });
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: file.key,
      })
      .promise();

    await this.publicFilesRepository.delete(fileId);
  }

  /**
   * @description uploads a multiple images to s3 bucket
   * @param files
   * @returns files with PrivateFile interface i.e key, user, post entity
   */

  async uploadPrivateFiles(
    post: Posts,
    user: User,
    files: Array<Express.Multer.File>,
  ): Promise<PrivateFile[]> {
    const s3 = new S3();
    const filePromises: Array<S3.ManagedUpload.SendData> = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileKey = `${uuid()}-${file.originalname}`;
      const uploadParams = {
        Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
        Key: fileKey,
        Body: file.buffer,
        ACL: 'private',
      };
      const data: S3.ManagedUpload.SendData = await s3
        .upload(uploadParams)
        .promise();

      filePromises.push(data);
    }

    const promiseDone = await Promise.all(filePromises);

    const newFiles = promiseDone.map(async (data) => {
      const unsave = this.privateFilesRepository.create({
        key: data.Key,
        user: user,
        post: post,
      });

      return await this.privateFilesRepository.save(unsave);
    });

    return Promise.all(newFiles);
  }

  /**
   * @description get the image file from its fileId, which is passed during upload to private File Repository
   * @param fileId
   * @returns stream and fileInfo (i.e URL for the image)
   * @todo get multiple images of a particular post with post id.
   */

  async getPrivateFiles(fileId: string) {
    const s3 = new S3();
    const fileInfo = await this.privateFilesRepository.findOne(
      { id: fileId },
      { relations: ['user', 'post'] },
    );

    if (fileInfo) {
      const stream = await s3
        .getObject({
          Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
          Key: fileInfo.key,
        })
        .createReadStream();
      return {
        stream,
        info: fileInfo,
      };
    }
    throw new NotFoundException();
  }

  async generatePresignedUrl(key: string) {
    const s3 = new S3();

    return s3.getSignedUrlPromise('getObject', {
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Key: key,
    });
  }
}
