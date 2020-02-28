import { SearchResult } from '../types/search-result.types'

export const getRankData = (): SearchResult[] => {
  const result = document.getElementById('res')
  const elements = result.querySelectorAll('h3')
  const data = [].slice.call(elements).map((element: HTMLElement, index) => {
    const link = element.parentElement.getAttribute('href')
    return {
      rank: index + 1,
      link,
      title: element.innerText,
    } as SearchResult
  })
  return data
}

export const removeContent = (): void => {
  const elements = document.querySelectorAll('script, link, style')
  for (const e of Array.from(elements)) {
    e.remove()
  }
}

export const nextPageSelector = (page: number): string => `#nav a[aria-label="Page ${page.toString()}"]`
