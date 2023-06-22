import { Injectable } from '@nestjs/common';
import { createApi } from 'unsplash-js';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SearchBodyDto } from '../dtos/search.body.dto';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { UserDto } from 'src/modules/user/dtos/user.dto';
import { SearchAndUploadDto } from '../dtos/searchAndUpload.dto';
import { File } from '../../file/schemas/file.schema';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<File>,
    private readonly configService: ConfigService,
  ) {}
  async search(body: SearchBodyDto) {
    const unsplash = createApi({
      accessKey: `${process.env.UNSPLASH_ACCESS_KEY}`,
    });
    const result = await unsplash.search.getPhotos({
      query: body.query,
      page: 0,
      perPage: 5,
    });
    return {
      status: 'OK',
      message: 'List of images uploaded successfully',
      data: result.response?.results.map((element) => {
        return {
          id: element.id,
          alt_description: element.alt_description,
          urls: element.links.download,
        };
      }),
    };
  }
  async searchAndUpload(
    { dataBuffer, fileName }: SearchAndUploadDto,
    user: UserDto,
  ) {
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
}
