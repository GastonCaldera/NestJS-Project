import {
  Controller,
  Post,
  UseGuards,
  Body,
  Put,
  Request,
  Res,
} from '@nestjs/common';
import { SearchService } from '../services/search.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { SearchBodyDto } from '../dtos/search.body.dto';
import { HttpService } from '@nestjs/axios';
import { SearchAndUploadBodyDto } from '../dtos/searchAndUpload.body.dto';
import { UserRequestDto } from 'src/modules/user/dtos/user.request.dto';
import type { Response } from 'express';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(
    private readonly httpService: HttpService,
    private searchService: SearchService,
  ) {}
  @UseGuards(AuthGuard)
  @Post('')
  search(@Body() body: SearchBodyDto) {
    return this.searchService.search(body);
  }
  @UseGuards(AuthGuard)
  @Put('')
  async searchAndUpload(
    @Res({ passthrough: true }) res: Response,
    @Body() body: SearchAndUploadBodyDto,
    @Request() req: UserRequestDto,
  ) {
    const urlResponse = await this.httpService.axiosRef.get(body.url, {
      responseType: 'arraybuffer',
    });
    const buffer = Buffer.from(urlResponse.data, 'base64');
    const response = await this.searchService.searchAndUpload(
      { dataBuffer: buffer, fileName: body.fileName },
      req.user,
    );
    if (response.status === 'OK') {
      res.status(404);
      return response;
    }
    return;
  }
}
