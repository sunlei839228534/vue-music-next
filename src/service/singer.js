import { get } from './base'

export function getSingerList() {
  return get('/api/getSingerList')
}

export function getSingerDetailList(singer) {
  return get('/api/getSingerDetail', {
    mid: singer.mid
  })
}