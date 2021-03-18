const isOutOfBounds = (limitx, limity) => (x, y) => 
  (x < 0 || x > limitx) || (y < 0 || y > limity)

export const createGrid = ({ width, height, paintedBoxes } = {}) => ({
  paintedBoxes: paintedBoxes || new Map(),
  width: width || 64,
  height: height || 64
})

export const createDrawing = () => ({
  width: 64,
  height: 64,
  layers: [{
    grid: createGrid({
      width: 64,
      height: 64
    })
  }]
})

export const paint = ({ x, y, color, shouldReplace }) => grid => {
  const coords = `${x},${y}`

  if (!shouldReplace && grid.paintedBoxes.has(coords)) {
    return
  }

  grid.paintedBoxes.set(coords, color)
}

export const _delete = ({ x, y }) => grid => grid.paintedBoxes.delete(`${x},${y}`)

export const flood = ({ x, y, targetColor, color } = {}) => grid => {
  const coords = `${x},${y}`
  const _targetColor = targetColor || grid.paintedBoxes.get(coords)
  const box = grid.paintedBoxes.get(coords)

  if (color === _targetColor) {
    return
  }

  if (box !== _targetColor || isOutOfBounds(grid.width, grid.height)(x, y)) {
    return
  }

  paint({ x, y, color, shouldReplace: true })(grid)
  flood({ x, y: y + 1, targetColor: _targetColor, color })(grid)
  flood({ x, y: y - 1, targetColor: _targetColor, color })(grid)
  flood({ x: x + 1, y, targetColor: _targetColor, color })(grid)
  flood({ x: x - 1, y, targetColor: _targetColor, color })(grid)
}

export const circle = ({ x, y, radius }) => grid => {
  // TODO - mid-point circle algorithm
}
