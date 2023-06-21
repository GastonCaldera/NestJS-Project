import { Module } from '@nestjs/common';
import { FileController } from './controllers/file.controller';
import { FileService } from './services/file.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { File, FileSchema } from './schemas/file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    AuthModule,
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
