import { Controller, Get } from '@nestjs/common'
import { CrawlerService } from '../services/crawler.service'

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Get()
  find(): string {
    this.crawlerService.create('Text')
    return JSON.stringify(this.crawlerService.findAll())
  }
}
