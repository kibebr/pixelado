import iro from '@jaames/iro'

export const createColorPicker = () => {
  const colorPicker = new iro.ColorPicker('#color-picker', {
    width: 200,
    color: '#FF0000'
  })
  
  
  return {
    getColor: () => colorPicker.color.hexString,
    setColor: hex => colorPicker.color.hexString = hex,
    remove: () => {}
  }
}
