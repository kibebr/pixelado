<script>
  import { onMount, onDestroy } from 'svelte'
  import { createColorPicker } from '../utils/ColorPicker.js'
  import { 
    createCanvas, 
    clearCanvas,
    paintAll, 
    renderChess, 
    getPosRelativeToCanvas, 
    getCoordinatesFromPos, 
    setCanvasBoxes } from '../utils/Canvas.js'
  import { createGrid, createDrawing, paint, _delete, flood } from '../../../core/Grid.js'
  import { debounce } from '../utils/Utils.js'
  import { pipe } from '../utils/FP.js'
  import { push } from 'svelte-spa-router'
  import { alert, loggedUser, drawingStore } from '../Store.js'
  import { getCurrentSession } from '../utils/Session.js'
  import { submitSketch } from '../services/SketchService.js'
  import { removeAllChildren } from '../utils/Elements.js'
  import Pencil from '../assets/pencil.svg'
  import Eraser from '../assets/eraser.svg'
  import Bucket from '../assets/bucket.svg'
  import Circle from '../assets/circle.svg'

  const canvasWidth = 480
  const canvasHeight = 480

  const backgroundCanvas = createCanvas({ width: canvasWidth, height: canvasHeight })
  backgroundCanvas.classList.add('draw-canvas')

  const drawings = drawingStore.get() || [createDrawing()]

  let selectedDrawing = drawings[0]
  let selectedLayer = selectedDrawing.layers[selectedDrawing.layers.length - 1]
  let isMousePressing = false
  let colorPicker
  let container
  let size
  let state = 'PAINT'
  console.log(selectedLayer.grid.width)
  let boxWidth = (canvasWidth / selectedLayer.grid.width)
  let boxHeight = (canvasWidth / selectedLayer.grid.height)

  const appendToContainer = canvas => {
    container.appendChild(canvas)
  }

  onMount(() => {  
    // initializes color picker
    colorPicker = createColorPicker()

    // paints the background canvas (the chess thing)
    paintAll('grey')(backgroundCanvas)
    renderChess({ 
      width: selectedLayer.grid.width, 
      height: selectedLayer.grid.height,
      boxWidth, 
      boxHeight 
    })(backgroundCanvas)

    // appends the canvases in order
    appendToContainer(backgroundCanvas)
    drawings.forEach(d => {
      d.layers.forEach(l => {
        l.canvas = createCanvas({
          width: canvasWidth,
          height: canvasHeight
        })

        l.canvas.classList.add('draw-canvas')
        container.appendChild(l.canvas)
      })
    })
  })

  onDestroy(() => {
    drawingStore.save(drawings)
    colorPicker.remove()
    document.body.classList.add('towhite')
  })

  const handleMouseAction = event => {
    if (event.type === 'click' || (event.type === 'mousemove' && isMousePressing)) {
      var { x, y } = pipe(
        getPosRelativeToCanvas(event.clientX, event.clientY),
        getCoordinatesFromPos(boxWidth, boxHeight),
      )(selectedLayer.canvas)

      switch (state) {
        case 'PAINT': 
          paint({
            x,
            y,
            color: colorPicker.getColor(),
            shouldReplace: true
          })(selectedLayer.grid)
          break
        case 'ERASE':
          _delete({ x, y })(selectedLayer.grid)
          break
      }
    }

    if (event.type === 'click') {
      switch (state) {
        case 'BUCKET':
          flood({
            x,
            y,
            color: colorPicker.getColor()
          })(selectedLayer.grid)
      }
    } 
    
    clearCanvas(selectedLayer.canvas)
    setCanvasBoxes({ boxWidth, boxHeight })(Object.fromEntries(selectedLayer.grid.paintedBoxes))(selectedLayer.canvas)
  }

  const handleZoom = () => {
    // TODO
  }

  const handleSubmit = () => {
    if (!$loggedUser) {
      alert.addAlert({ text: 'You must be logged-in to submit your sketch!', type: 'error' })
    } else {
      submitSketch({
        sketch: {
          title: 'my beautiful sketch',
          boxes: Object.fromEntries(grid.paintedBoxes),
          size: grid.size.width,
          dominantColors: ['red']
        }, 
        token: (getCurrentSession()).token
      })
        .then(() => {
          alert.addAlert({ text: 'all good', type: 'success' })
        })
        .catch(err => {
          alert.addAlert({ text: err, type: 'error' })
        })
    }
  }

</script>

<style>
  :global(.draw-canvas) {
    cursor: crosshair;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  #side-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 40px;
    z-index: 300;
  }

  .side-bar-square {
    position: relative;
    width: 100%;
    height: 40px;
    cursor: pointer;
  }

  .selected-square {
    background-color: #1F2937;
  }

  .side-bar-icon {
    width: 24px;
    height: 24px;
  }

  #color-picker {
    position: absolute;
    left: 5px;
    bottom: 30px;
  }

  #submit {
    font-weight: bold;
    position: absolute;
    right: 70px;
    bottom: 20px;
    border-bottom: 2px solid lime;
    cursor: pointer;
  }

  .a {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 10px;
    text-align: center;
  }

  #grids {
    font-weight: bold;
    position: absolute;
    top: 5px;
  }

  #layers {
    position: absolute;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.01);
    width: 250px;
    height: 100px;
  }
</style>

<div id='draw-view'>
  <div id='side-bar'>
    <a href='#/'>
      <div class='side-bar-square'>
        <div id='box' class='side-bar-icon absolute-center gradient'></div>
      </div>
    </a>
    <div class='side-bar-square' class:selected-square={state === 'PAINT'} on:click={() => state = 'PAINT'}>
      <div class='side-bar-icon absolute-center'>{@html Pencil}</div>
    </div>
    <div class='side-bar-square' class:selected-square={state === 'ERASE'} on:click={() => state = 'ERASE'}>
      <div class='side-bar-icon absolute-center'>{@html Eraser}</div>
    </div>
    <div class='side-bar-square' class:selected-square={state === 'BUCKET'} on:click={() => state = 'BUCKET'}>
      <div class='side-bar-icon absolute-center'>{@html Bucket}</div>
    </div>
    <div class='side-bar-square' class:selected-square={state === 'CIRCLE'} on:click={() => state = 'CIRCLE'}>
      <div class='side-bar-icon absolute-center'>{@html Circle}</div>
    </div>
  </div>
  <div id='color-picker'></div>
  <div 
       id='container' 
       bind:this={container} 
       on:click={handleMouseAction}
       on:mousemove={handleMouseAction} 
       on:mousewheel={event => debounce(() => handleZoom(event), 30)}
       on:mousedown={() => isMousePressing = true} 
       on:mouseup={() => isMousePressing = false} 
       />
  </div>
  <div id='layers' class='center-x'>

  </div>
  <span id='submit' on:click={handleSubmit}>Submit</span>
