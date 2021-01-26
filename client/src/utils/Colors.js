export const getRandomPastelColor = () => 'hsla(' + ~~(360 * Math.random()) + ',' + '70%,' + '80%,1)'
export const createGradient = (c1, c2) => `linear-gradient(160deg, ${c1} 0%, ${c2 || c1} 100%)`
export const createGradientFromSketch = ({ dominantColors }) => createGradient(dominantColors[0], dominantColors[1])

