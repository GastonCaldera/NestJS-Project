import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Request,
  UseGuards,
  Get,
  Body,
  Res,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../services/file.service';
import { Express } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { UserRequestDto } from 'src/modules/user/dtos/user.request.dto';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { DownloadFilesBodyDto } from '../dtos/download.body.dto';
import { UpdateFileBodyDto } from '../dtos/update.body.dto';
import type { Response } from 'express';

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
  @Put('update')
  async updateFile(
    @Res({ passthrough: true }) res: Response,
    @Body() body: UpdateFileBodyDto,
  ) {
    const updateFileResponse = await this.fileUploadService.updateFile(body);
    if (updateFileResponse.status !== 'OK') {
      res.status(404);
      return updateFileResponse;
    }
    return updateFileResponse;
  }

  @UseGuards(AuthGuard)
  @Post('download')
  async getFile(
    @Res({ passthrough: true }) res: Response,
    @Body() body: DownloadFilesBodyDto,
  ) {
    const getFiles = await this.fileUploadService.downloadFiles(body);
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${getFiles.fileName}"`,
    });
    if (getFiles.status !== 'OK') {
      res.status(404);
      return getFiles;
    }
    return getFiles.data;
  }
}
