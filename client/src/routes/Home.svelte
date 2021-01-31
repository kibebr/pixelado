<script>
  import SpinningSquare from '../components/SpinningSquare.svelte'
  import LoginRegisterModal from '../components/LoginRegisterModal.svelte'
  import { fly } from 'svelte/transition'
  import { jump } from '../utils/svelteCustomTransitions.js'
  import { onMount } from 'svelte'
  import { createCanvas, setCanvasBoxes, paintAll } from '../utils/Canvas.js'
  import { createGradientFromSketch } from '../utils/Colors.js'
  import { fetchSketches } from '../services/SketchService.js'
  import { push } from 'svelte-spa-router'
  import { storedSketches, loggedUser, isLoginModalOpen } from '../Store.js'
  import { createSketchGradient } from '../utils/Elements.js'
  import Select from 'svelte-select'
  import { toObjFromId, getVotes } from '../utils/Utils.js'
  import Clap from '../assets/clap.svg'
  import Heart from '../assets/heart.svg'
  import Okay from '../assets/okay.svg'

  let paginationRange = [0, 10]
  let sketches = null
  let canvases = {}

  const filterOptions = [
    { value: 'popular', label: 'Popular' },
    { value: 'new', label: 'New' },
  ]
  let selectedFilter = 'popular'

  onMount(async () => {
    sketches = await fetchSketches(
      'popular',
      [0, 10]
    )
    storedSketches.set(toObjFromId(sketches))
  })

  const selectFilter = async newFilter => {
    selectedFilter = newFilter
    sketches = await fetchSketches(
      selectedFilter,
      [0, 10]
    )
  }

  $: {
    for (const [id, canvas] of Object.entries(canvases)) {
      paintAll('white')(canvas)
      setCanvasBoxes({
        size: $storedSketches[id].size.w,
        boxWidth: canvas.width / $storedSketches[id].size.w,
        boxHeight: canvas.height / $storedSketches[id].size.h
      })($storedSketches[id].boxes)(canvas)
    }
  }
</script>

<style>
  canvas {
    display: block;
    width: 224px;
    height: 224px;
    image-rendering: pixelated;
  }

  #bar {
    margin-bottom: 40px;
  }

  .bar-selection-text {
    font-size: 15px;
    padding: 10px;
    border-radius: 3px;
    margin-right: 25px;
  }

  .bar-div {
    flex: 1;
    display: flex;
    align-items: center;
  }

  #left {
    justify-content: flex-start;
    --padding: 200px;
    --borderFocusColor: var(--color-grey);
    --background: #FEFEFE;
    --itemIsActiveBG: var(--color-blue);
  }

  #center {
    justify-content: center;
  }

  #right {
    justify-content: flex-end;
  }

  #sketch-gallery {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, 224px);
    grid-auto-flow: dense;
    grid-column-gap: 25px;
    grid-row-gap: 50px;
  }

  .sketch-container {
    text-align: center;
  }

  .sketch-title {
    margin-bottom: 10px;
  }

  .icon {
    display: inline-block;
    width: 16px;
    height: 16px;
  }

  .made-by {
    float: left;
    color: var(--color-darkgrey);
    display: block;
  }

  .votes {
    float: right;
    text-align: center;
  }

  .sketch-info {
    margin-top: 5px;
  }

  @media only screen and (max-width: 541px) {
    #sketch-gallery {
      padding-top: 50px;
      justify-items: center;
      justify-content: center;
      align-content: center;
    }
  }
</style>

<div id='home-view'>
  <div id='bar' class='flex align-center justify-center'>
    <div id='left' class='bar-div'>
      <Select 
         items={[{
         value: 'popular',
         label: 'Popular'
         }, {
         value: 'new',
         label: 'New'
         }]} 
         selectedValue={{ value: 'popular', label: 'Popular' }}
         isSearchable={false}
         isClearable={false}
         on:select={({ detail }) => selectFilter(detail.value)}></Select>
    </div>
    <div id='center' class='bar-div'>
      <div>
        <span class='bar-selection-text selected'>Drawings</span>
        <span class='bar-selection-text unavailable'>Tournaments</span>
      </div>
    </div>
    <div id='right' class='bar-div'>

    </div>
  </div>
  <section id='sketch-gallery'>
    {#if sketches}
      {#each sketches as sketch}
        <div transition:jump='{{ duration: 60 }}' class='sketch-container'>
          <p class='sketch-title'>{sketch.title}</p>
          <a href='#/sketch/{sketch.id}'>
            <canvas width=224 height=224 class='opacity-effect' bind:this={canvases[sketch.id]}></canvas>
          </a>
          <div class='sketch-info'>
            <div class='votes'>
              {#if sketch.votes.claps}
                <div class='icon icon-jump'>
                  {@html Clap}
                </div>
              {/if}
              {#if sketch.votes.hearts}
                <div class='icon icon-jump'>
                  {@html Heart}
                </div>
              {/if}
              {#if sketch.votes.okays}
                <div class='icon icon-jump'>
                  {@html Okay}
                </div>
              {/if}
            </div>
            <a href='#/user/{sketch.author}'>
              <span class='made-by'>by {sketch.author}</span>
            </a>
          </div>
        </div>
      {/each}
    {:else}
      <div class='absolute-center'>
        <SpinningSquare />
      </div>
    {/if}
  </section>
</div>
