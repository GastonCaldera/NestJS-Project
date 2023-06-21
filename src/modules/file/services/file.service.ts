import { Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { UserDto } from 'src/modules/user/dtos/user.dto';
import { File } from '../schemas/file.schema';
import { DownloadFilesBodyDto } from '../dtos/download.body.dto';
import { UpdateFileBodyDto } from '../dtos/update.body.dto';
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
      const findFile: File[] = await this.fileModel
        .find({ userId: user._id })
        .exec();
      return {
        status: 'OK',
        message: 'Files found successfully',
        data: findFile,
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
  async updateFile({ _id, fileName }: UpdateFileBodyDto) {
    const findFile: File | null = await this.fileModel
      .findByIdAndUpdate({ _id }, { fileName })
      .exec();
    if (!findFile) {
      return {
        status: 'ERROR',
        message: 'File not found',
        data: '',
      };
    }
    return {
      status: 'OK',
      message: 'File updated successfully',
      data: '',
    };
  }
  async downloadFiles({ _id, key }: DownloadFilesBodyDto) {
    try {
      const findFile: File | null = await this.fileModel
        .findOne({ _id, key })
        .exec();
      if (findFile === null) {
        return {
          status: 'ERROR',
          message: 'File not found',
          data: '',
        };
      }
      const s3 = new S3();
      const streamFile = await s3
        .getObject({
          Bucket: this.configService.get('AWS_BUCKET_NAME') || '',
          Key: key,
        })
        .createReadStream();
      return {
        status: 'OK',
        fileName: findFile.fileName,
        data: new StreamableFile(streamFile),
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
