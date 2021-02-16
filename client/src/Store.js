import { writable } from 'svelte/store'
import { getCurrentSession, setCurrentSession } from './utils/Session.js'

const createAlert = timeout => {
  const { subscribe, set } = writable(null)
  let timer = null

  return {
    subscribe,
    addAlert: data => {
      clearTimeout(timer)
      set(data)
      timer = setTimeout(() => set(null), timeout)
    }
  }
}

const createDrawingStorer = () => {
  const { subscribe, set } = writable(null)
  localStorage.setItem('savedDrawings', null)

  return {
    subscribe,
    save: drawings => {
      // immutably create a new drawings object, but with the canvas removed and the layers' grid ready to be stringified (Map can't be stringified)
      const toStringify = drawings.map(drawing => ({
        ...drawing,
        layers: drawing.layers.map(l => ({
          grid: {
            width: l.grid.width,
            height: l.grid.height,
            paintedBoxes: [...l.grid.paintedBoxes]
          }
        }))
      }))
      
      localStorage.setItem('savedDrawings', JSON.stringify(toStringify))
      // localStorage.setItem('savedGrid', JSON.stringify({
      //   paintedBoxes: [...grid.paintedBoxes],
      //   size: grid.size
      // }))
    },
    get: () => {
      const parsed = JSON.parse(localStorage.getItem('savedDrawings'))

      if (parsed) {
        parsed.forEach(p => {
          p.layers.forEach(l => {
            l.grid.paintedBoxes = new Map(l.grid.paintedBoxes)
          })
        })
      } else {
        return null
      }

      return parsed
    }
  }
}

export const storedSketches = writable({})
export const loggedUser = writable(getCurrentSession())
export const isLoginModalOpen = writable(false)
export const alert = createAlert(3000)
export const drawingStore = createDrawingStorer()

loggedUser.subscribe(setCurrentSession)
