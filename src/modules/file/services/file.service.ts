import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { UserDto } from 'src/modules/user/dtos/user.dto';
import { File } from '../schemas/file.schema';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<File>,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(dataBuffer: Buffer, fileName: string, user: UserDto) {
    try {
      const s3 = new S3();
      const uploadResult = await s3
        .upload({
          Bucket: this.configService.get('AWS_BUCKET_NAME') || '',
          Body: dataBuffer,
          Key: `${uuid()}-${fileName}`,
        })
        .promise();

      const fileStorageInDB = {
        userId: user._id,
        fileName: fileName,
        fileUrl: uploadResult.Location,
        key: uploadResult.Key,
      };
      const createdFile = new this.fileModel(fileStorageInDB);
      createdFile.save();
      return {
        status: 'OK',
        message: 'File upload successfully',
        data: createdFile,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 'ERROR',
        message: 'Internal server error',
        data: '',
      };
    }
  }
  async getFiles(user: UserDto) {
    try {
      const findUser: File[] = await this.fileModel
        .find({ userId: user._id })
        .exec();
      return {
        status: 'OK',
        message: 'Files found successfully',
        data: findUser,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 'ERROR',
        message: 'Internal server error',
        data: '',
      };
    }
  }
}
