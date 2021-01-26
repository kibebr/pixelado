<script>
  import { push } from 'svelte-spa-router'
  import { onMount } from 'svelte'
  import { fetchUserWithUsername } from '../services/UserService.js'
  import SpinningSquare from '../components/SpinningSquare.svelte'
  import { jump } from '../utils/svelteCustomTransitions.js'
  import { createCanvas, setCanvasBoxes, paintAll } from '../utils/Canvas.js'
  import { loggedUser, alert } from '../Store.js'
  import { getVotes, toObjFromId } from '../utils/Utils.js'
  import Clap from '../assets/clap.svg'
  import Heart from '../assets/heart.svg'
  import Okay from '../assets/okay.svg'

  export let params = {}
    
  let user
  let canvases = {}
  let sketchesById = {}

  const handleLogoff = () => {
    loggedUser.set(null)
    alert.addAlert({
      text: `Hey ${user.username}, you logged off!`,
      type: 'success'
    })
  }

  onMount(async () => {
    user = await fetchUserWithUsername(params.username)
    sketchesById = toObjFromId(user.sketches)
  })

  $: {
    for (const [id, canvas] of Object.entries(canvases)) {
      paintAll('white')(canvas)
      setCanvasBoxes({
        size: sketchesById[id].size.w,
        boxWidth: canvas.width / sketchesById[id].size.w,
        boxHeight: canvas.height / sketchesById[id].size.h
      })(sketchesById[id].boxes)(canvas)
    }
  }
</script>

<style>
  #profile-view {
  }

  #profile-card {
    margin: auto;
  }

  #fake-pic {
    width: 110px;
    height: 110px;
    background-color: black;
    display: inline-block;
  }

  #profile-info {
    display: inline-block;
    margin-left: 40px;
    vertical-align: top;
  }

  #username {
    font-weight: bold;
    font-size: 1.6em;
  }

  #down {
    margin-top: 50px;
    display: flex;
    flex-wrap: wrap;
  }

  #sidebar {
    width: 155px;
    display: inline-block;
    vertical-align: top;
  }

  #gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, 224px);
    grid-column-gap: 25px;
    grid-row-gap: 25px;
    flex-grow: 1;
  }

  #biography {
    width: 60%;
  }

  span {
    vertical-align: top;
  }

  .gallery-selection {
    font-weight: bold;
  }

  #votes {
    float: right;
  }

  .vote-icon {
    width: 36px;
    height: 36px;
  }

  .vote-wrapper {
    display: inline-block;
    margin-left: 10px;
    text-align: center;
  }
  
  .vote-count {
    font-weight: bold;
    font-size: 0.9em;
  }

  .unavailable {
    color: var(--color-darkgrey);
    cursor: not-allowed;
    font-size: 0.9em;
  }
</style>

<section id='profile-view'>
  {#if user}
    <div id='profile-card'>
      <div id='fake-pic'></div>
      <div id='profile-info'>
        <span id='username' style='color: {user.accentColor}'>{user.username}</span>
        <p id='biography'>{user.biography}<p>
      </div>
      <div id='votes'>
        <div class='vote-wrapper'>
          <div class='vote-icon icon-jump'>{@html Clap}</div>
          <span class='vote-count'>{user.sketches.reduce((a, { votes }) => a + (votes.claps && getVotes(votes.claps)) || 0, 0)}</span>
        </div>
        <div class='vote-wrapper'>
          <div class='vote-icon icon-jump'>{@html Heart}</div>
          <span class='vote-count'>{user.sketches.reduce((a, { votes }) => a + (votes.hearts && getVotes(votes.hearts)) || 0, 0)}</span>
        </div>
        <div class='vote-wrapper'>
          <div class='vote-icon icon-jump'>{@html Okay}</div>
          <span class='vote-count'>{user.sketches.reduce((a, { votes }) => a + (votes.okays && getVotes(votes.claps)) || 0, 0)}</span>
        </div>
      </div>
    </div>
    <div id='down'>
      <div id='sidebar'>
        <p class='gallery-selection selected'>Drawings ({user.sketches.length})</p>
        <p class='gallery-selection unavailable'>Voted</p>
        <p class='gallery-selection unavailable'>Collections</p>
      </div>
      <div id='gallery'>
        {#if user.sketches.length !== 0}
          {#each user.sketches as sketch}
            <a href='#/sketch/{sketch.id}'>
              <canvas in:jump='{{ duration: 30 }}' class='opacity-effect' width=224 height=224 bind:this={canvases[sketch.id]}></canvas>
            </a>
          {/each}
        {:else}
          <p class='gallery-selection'>Seems like this user hasn't posted anything yet!</p>
        {/if}
      </div>
    </div>
  {:else}
    <div class='absolute-center'>
      <SpinningSquare />
    </div>
  {/if}
</section>
