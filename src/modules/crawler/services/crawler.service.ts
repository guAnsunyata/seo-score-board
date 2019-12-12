import _ from 'lodash'
import puppeteer from 'puppeteer'
import { Injectable } from '@nestjs/common'
import { SearchResult } from '../types/search-result.types'

@Injectable()
export class CrawlerService {
  private readonly arr: ResultStore = {}

  store(keyword: string, result: ResultStore) {
    this.arr[keyword] = result
  }

  findAll(): ResultStore[] {
    return this.arr
  }

  async fetchPage(keyword: string): Promise<string> {
    // go
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(getUrl(keyword), gotoOptions)

    // evaluates
    await page.evaluate(removeContent)
    await page.waitForSelector('h3')
    const data = await page.evaluate(getRankData)

    browser.close()

    // cache
    this.store(keyword, data)

    return Promise.resolve(data)
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

type ResultStore = any

// in browser
const getRankData = () => {
  const elements = document.querySelectorAll('h3 > span')
  const data = [].slice.call(elements).map((element: HTMLElement, index) => {
    const link = element.parentElement.parentElement.getAttribute('href')
    return {
      rank: index + 1,
      link,
      title: element.innerText,
    } as SearchResult
  })
  return JSON.stringify(data)
}

const removeContent = () => {
  const elements = document.querySelectorAll('script, link, style')
  for (const e of Array.from(elements)) {
    e.remove()
  }
}
