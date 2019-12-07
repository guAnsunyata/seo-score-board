import { Module } from '@nestjs/common'
import { CrawlerController } from './controllers/crawler.controller'
import { CrawlerService } from './services/crawler.service'

@Module({
  controllers: [CrawlerController],
  providers: [CrawlerService],
})
export class CrawlerModule {}
