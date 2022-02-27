import { get } from './base'

export function getSongs(songs) {
  return get('/api/getSongsUrl', { mid: songs.map(i => i.mid) }).then(res => {
    const { map } = res
    return songs.map(i => {
      i.url = map[i.mid]
      return i
    }).filter(i => i.url.indexOf('vkey') > -1)
  })
}