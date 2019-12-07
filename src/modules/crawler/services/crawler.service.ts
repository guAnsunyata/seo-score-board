import { Injectable } from '@nestjs/common'

@Injectable()
export class CrawlerService {
  private readonly arr: Result[] = []

  create(result: Result) {
    this.arr.push(result)
  }

  findAll(): Result[] {
    return this.arr
  }
}

type Result = any
