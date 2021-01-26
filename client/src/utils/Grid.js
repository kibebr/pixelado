const isOutOfBounds = (limitx, limity) => (x, y) => 
  (x < 0 || x > limitx) || (y < 0 || y > limity)

export const createGrid = ({ width, height, paintedBoxes } = {}) => ({
  paintedBoxes: paintedBoxes || new Map(),
  width: width || 32,
  height: height || 32,
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

  if (box !== _targetColor || isOutOfBounds(grid.size.w, grid.size.h)(x, y)) {
    return
  }

  paint({ x, y, color, shouldReplace: true })(grid)
  flood({ x, y: y + 1, targetColor: _targetColor, color })(grid)
  flood({ x, y: y - 1, targetColor: _targetColor, color })(grid)
  flood({ x: x + 1, y, targetColor: _targetColor, color })(grid)
  flood({ x: x - 1, y, targetColor: _targetColor, color })(grid)
}

