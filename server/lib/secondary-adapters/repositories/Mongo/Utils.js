export const getTimestamp = objectId => objectId.getTimestamp()
export const timestampToDate = timestamp => `${timestamp.getDate()}-${timestamp.getMonth() + 1}-${timestamp.getFullYear()}`
export const objectIdToDate = objectId => timestampToDate(getTimestamp(objectId)) // could use pipe
