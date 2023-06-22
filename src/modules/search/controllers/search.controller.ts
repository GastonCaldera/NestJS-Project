import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { SearchService } from '../services/search.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { SearchBodyDto } from '../dtos/search.body.dto';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}
  @UseGuards(AuthGuard)
  @Post('')
  search(@Body() body: SearchBodyDto) {
    return this.searchService.search(body);
  }
}
