import { stringToCoord } from './stringToCoord.js'
import { isOdd } from './Utils.js'

export const createCanvas = ({ width, height }) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.style.width = width
  canvas.style.height = height
  return canvas
}


export const clearCanvas = canvas => {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

export const paintBlock = ({ x, y, width, height, color }) => canvas => {
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = color
  ctx.fillRect(x * width, y * height, width, height)
}

export const paintAll = color => canvas => {
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = color
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

export const renderChess = ({ width, height, boxWidth, boxHeight }) => canvas => {
  for (let x = 0; x < width; ++x) {
    for (let y = 0; y < height; ++y) {
      if (!isOdd(x) ^ !isOdd(y)) {
        paintBlock({
          x,
          y,
          width: boxWidth,
          height: boxHeight,
          color: '#D9D9D9'
        })(canvas)
      }
    }
  }
}

export const setCanvasBoxes = ({ boxWidth, boxHeight }) => boxes => canvas => {
  for (const [key, val] of Object.entries(boxes)) {
    const { x, y } = stringToCoord(key)
    paintBlock({
      x,
      y,
      width: boxWidth,
      height: boxHeight,
      color: val
    })(canvas)
  }
}

export const getPosRelativeToCanvas = (clientX, clientY) => canvas => {
  const boundingRect = canvas.getBoundingClientRect()
  return {
    x: clientX - boundingRect.left,
    y: clientY - boundingRect.top
  }
}

export const getCoordinatesFromPos = (boxWidth, boxHeight) => ({ x, y }) => ({
  x: x / boxWidth | 0,
  y: y / boxHeight | 0
})

/*
 * NOT USED IN PRODUCTION BUT SAVED JUST IN CASE
 *
 */

// export const renderGrid = size => canvas => {
//   const ctx = canvas.getContext('2d')

//   const boxWidth = canvas.width / size
//   const boxHeight = canvas.height / size

//   ctx.beginPath()
//   for (let x = 0; x <= canvas.width; x += boxWidth) {
//     ctx.moveTo(x, 0)
//     ctx.lineTo(x, canvas.height)
//   }
//   ctx.strokeStyle = 'black'
//   ctx.lineWidth = 1
//   ctx.stroke()

//   ctx.beginPath()
//   for (let y = 0; y <= canvas.height; y += boxHeight) {
//     ctx.moveTo(0, y)
//     ctx.lineTo(canvas.width, y)
//   }
//   ctx.strokeStyle = 'black'
//   ctx.stroke()
// }
