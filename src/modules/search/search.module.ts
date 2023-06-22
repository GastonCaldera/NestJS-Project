import { Module } from '@nestjs/common';
import { SearchController } from './controllers/search.controller';
import { SearchService } from './services/search.service';
import { HttpModule } from '@nestjs/axios/dist';
import { File, FileSchema } from '../file/schemas/file.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
