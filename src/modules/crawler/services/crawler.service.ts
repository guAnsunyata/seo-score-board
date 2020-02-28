import _ from 'lodash'
import R from 'ramda'
import puppeteer from 'puppeteer'
import { Injectable } from '@nestjs/common'
import { SearchResult } from '../types/search-result.types'
import FetchJob from '@modules/crawler/domain/fetch/FetchJob'

@Injectable()
export class CrawlerService {
  private _browser: puppeteer.Browser = null
  private _page: puppeteer.Page = null
  private fetchJob: FetchJob

  async bootstrap() {
    this._browser = await puppeteer.launch()
    this._page = await this._browser.newPage()
    this.fetchJob = new FetchJob()
  }

  async page() {
    if (!this._page) {
      await this.bootstrap()
    }

    return this._page
  }

  async fetchPage(keyword: string, pageNumber: number = 2): Promise<string> {
    const page = await this.page()
    await page.goto(getUrl(keyword), gotoOptions)

    const doTimesAndBatchPromise = <T>(
      times: number,
      fn: () => Promise<T>
    ):Promise<T[]> => Promise.all(_.times(times, fn))

    const addRankFromIndex = (r: SearchResult, index) => ({ ...r, rank: index + 1 })

    const data = await R.pipeP(
      // crawl SERPs from page 1 to N
      _.partialRight(doTimesAndBatchPromise, (index) => this.fetchJob.exec(page, index)),

      // transform
      _.flatten,
      _.partialRight(_.map, addRankFromIndex),
    )(pageNumber)

    // this._browser.close()

    return Promise.resolve(JSON.stringify(data))
  }
}

const getUrl = (query, page = 1) => {
  const q = encodeURIComponent(query)
  const start = (page === 1) ? 0 : page++ * 10
  return `https://www.google.com/search?q=${q}&start=${start}`
}

const gotoOptions = {
  waitUntil: 'networkidle0' as const,
  timeout: 6000,
}
