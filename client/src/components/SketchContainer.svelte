<script>
  import { jump } from '../utils/svelteCustomTransitions.js'
  import { onMount } from 'svelte'
  import { storedSketches } from '../Store.js' 
  import { setCanvasBoxes, paintAll } from '../utils/Canvas.js'
  import Clap from '../assets/clap.svg'
  import Heart from '../assets/heart.svg'
  import Okay from '../assets/okay.svg'

  export let sketch

  let canvas

  $: {
    if (canvas) {
      paintAll('white')(canvas)
      setCanvasBoxes({
        size: $storedSketches[sketch.id].size.w,
        boxWidth: canvas.width / $storedSketches[sketch.id].size.w,
        boxHeight: canvas.height / $storedSketches[sketch.id].size.h
      })($storedSketches[sketch.id].boxes)(canvas)
    }
  }
</script>

<style>
  .sketch-container {
    text-align: center;
  }
  .sketch-title {
    margin-bottom: 10px;
  }

  .made-by {
    float: left;
    color: var(--color-darkgrey);
    display: block;
  }

  .sketch-info {
    margin-top: 5px;
  }
  .votes {
    float: right;
    text-align: center;
  }
  .icon {
    display: inline-block;
    width: 16px;
    height: 16px;
  }
</style>

<div transition:jump='{{ duration: 30 }}' class='sketch-container'>
  <p class='sketch-title'>{sketch.title}</p>
  <a aria-label='Go to sketch' href='#/sketch/{sketch.id}'>
    <canvas width=224 height=224 class='opacity-effect' bind:this={canvas}></canvas>
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
  </div>
  <a aria-label='Go to owner profile' href='#/user/{sketch.author}'>
    <span class='made-by'>by {sketch.author}</span>
  </a>
</div>
