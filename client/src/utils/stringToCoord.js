export const stringToCoord = str => {
  const commaI = str.indexOf(',')
  return {
    x: Number(str.substr(0, commaI)),
    y: Number(str.substr(commaI + 1))
  }
}
