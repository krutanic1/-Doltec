import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('api/v1/search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('autocomplete')
  async autocomplete(@Query('q') query: string) {
    return this.searchService.autocomplete(query);
  }
}
