import storage from 'good-storage'
import { storeKey } from 'vuex'

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  } else {
    return
  }
}

export function save(item, key, compare, maxLen) {
  const items = storage.get(key, [])
  insertArray(items, item, compare)
  storage.set(key, items)
  return items
}

export function remove(key, compare) {
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}

export function load(key) {
  return storage.get(key, [])
}

export function clear(key) {
  storage.remove(key)
  return []
}