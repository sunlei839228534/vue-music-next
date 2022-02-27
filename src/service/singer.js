import { get } from './base'

export function getSingerList() {
  return get('/api/getSingerList')
}

export function getSingerDetailList(mid) {
  return get('/api/getSingerDetail', {
    mid
  })
}