import puppeteer from 'puppeteer'
import * as serpsQuery from '@modules/crawler/serps-query/index'
import { SearchResult } from '@modules/crawler/types/search-result.types'

export default class FetchJob {

  async exec(page: puppeteer.Page, number: number): Promise<SearchResult[]> {
    const { removeContent, getRankData, nextPageSelector } = serpsQuery

    if (number !== 0) {
      await page.click(nextPageSelector(number + 1))
      await page.waitForSelector('#res')
    }

    await page.evaluate(removeContent)
    await page.waitForSelector('#res')

    return await page.evaluate(getRankData)
  }
}
