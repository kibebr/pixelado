<script>
  import { push } from 'svelte-spa-router'
  import { onMount } from 'svelte'
  import { fetchUserWithUsername } from '../services/UserService.js'
  import SketchContainer from '../components/SketchContainer.svelte'
  import SpinningSquare from '../components/SpinningSquare.svelte'
  import { createCanvas } from '../utils/Canvas.js'
  import { loggedUser, alert } from '../Store.js'
  import { getVotes, toObjFromId } from '../utils/Utils.js'
  import Clap from '../assets/clap.svg'
  import Heart from '../assets/heart.svg'
  import Okay from '../assets/okay.svg'
  import Edit from '../assets/edit.svg'
  import ProfilePic from '../public/defaultprofilepic.jpg'

  export let params = {}
    
  let user
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

</script>

<style>
  #profile-view {
  }

  #profile-card {
    margin: auto;
  }

  #profile-pic {
    position: relative;
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background-color: black;
    display: inline-block;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    transition: opacity 0.3s;
  }

  #profile-pic:hover {
    opacity: 0.8;
  }

  #edit-icon {
    position: absolute;
    width: 40px;
    height: 16px;
    fill: white;
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
    position: relative;
    width: auto;
    margin-right: 20px;
    display: inline-block;
  }

  #gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, 224px);
    grid-column-gap: 25px;
    grid-row-gap: 25px;
    flex-grow: 1;
  }

  #log-off-wrapper {
    position: absolute;
    bottom: 0;
    text-align: center;
  }

  #log-off-wrapper>button {
    width: 70px;
    background-color: var(--color-red);
  }

  #drawings-sidebar {
    margin-right: 20px;
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
      <img src={ProfilePic} id='profile-pic' alt='Default profile picture.' />
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
        <p id='drawings-sidebar' class='gallery-selection selected'>Drawings ({user.sketches.length})</p>
        <p class='gallery-selection unavailable'>Voted</p>
        <p class='gallery-selection unavailable'>Collections</p>
        {#if $loggedUser?.username === user.username}
          <div id='log-off-wrapper'>
            <button on:click={handleLogoff}>Log-off</button>
          </div>
        {/if}
      </div>
      <div id='gallery'>
        {#if user.sketches.length !== 0}
          {#each user.sketches as sketch}
            <SketchContainer sketch={sketch} />
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
