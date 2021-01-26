import { createGradientFromSketch } from './Colors.js'

export const createSketchGradient = ({ width, height, sketch }) => {
  const gradient = document.createElement('div')
  gradient.style.width = width
  gradient.style.height = height
  gradient.style.backgroundImage = createGradientFromSketch(sketch)
  gradient.classList.add('sketch-gradient')
  return gradient
}

export const removeAllChildren = el => {
  while (el.firstChild) {
    el.removeChild(el.lastChild)
  }
}
