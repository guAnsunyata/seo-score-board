import { Controller, Get, Param } from '@nestjs/common'
import { CrawlerService } from '../services/crawler.service'

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Get(':keyword')
  async find(@Param() params): Promise<string> {
    const keyword = decodeURIComponent(params.keyword)
    const data = await this.crawlerService.fetchPage(keyword)
    return JSON.parse(data)
  }
}
