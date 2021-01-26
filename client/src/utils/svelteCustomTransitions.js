export const jump = (node, { duration }) => ({
  duration,
  css: t => `transform: scale(${0.5 + (t * 0.5)});`
})
