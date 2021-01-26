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

  return {
    subscribe,
    save: drawing => {
      return null
      // localStorage.setItem('savedGrid', JSON.stringify({
      //   paintedBoxes: [...grid.paintedBoxes],
      //   size: grid.size
      // }))
    },
    get: () => {
      return null
      // const parsed = JSON.parse(localStorage.getItem('savedGrid'))

      // if (parsed) {
      //   return { 
      //     paintedBoxes: new Map(parsed.paintedBoxes),
      //     size: parsed.size
      //   }
      // } else {
      //   return null
      // }
    }
  }
}

export const storedSketches = writable({})
export const loggedUser = writable(getCurrentSession())
export const isLoginModalOpen = writable(false)
export const alert = createAlert(3000)
export const drawingStore = createDrawingStorer()

loggedUser.subscribe(setCurrentSession)
