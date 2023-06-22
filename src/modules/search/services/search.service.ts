import { Injectable } from '@nestjs/common';
import { createApi } from 'unsplash-js';
import { SearchBodyDto } from '../dtos/search.body.dto';

@Injectable()
export class SearchService {
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
}
