import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Request,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../services/file.service';
import { Express } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { UserRequestDto } from 'src/modules/user/dtos/user.request.dto';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { DownloadFilesBodyDto } from '../dtos/download.body.dto';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private fileUploadService: FileService) {}

  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: UserRequestDto,
  ) {
    const uploadedFile = await this.fileUploadService.uploadFile(
      file.buffer,
      file.originalname,
      req.user,
    );
    return uploadedFile;
  }
  @UseGuards(AuthGuard)
  @Get('list')
  async getFiles(@Request() req: UserRequestDto) {
    const getFiles = await this.fileUploadService.getFiles(req.user);
    return getFiles;
  }
  @UseGuards(AuthGuard)
  @Post('download')
  async getFile(
    @Request() req: UserRequestDto,
    @Body() body: DownloadFilesBodyDto,
  ) {
    const getFiles = await this.fileUploadService.downloadFiles(req.user, body);
    return getFiles;
  }
}
