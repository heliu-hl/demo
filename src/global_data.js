const globalData = {
    modalShow:true
}
export function setGlobalData (key, val) {
  globalData[key] = val
}
export function getGlobalData (key) {
  return globalData[key]
}