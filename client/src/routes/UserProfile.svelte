<script>
  import { push } from 'svelte-spa-router'
  import { onMount } from 'svelte'
  import { fetchUserWithUsername } from '../services/UserService.js'
  import SketchContainer from '../components/SketchContainer.svelte'
  import SpinningSquare from '../components/SpinningSquare.svelte'
  import { createCanvas } from '../utils/Canvas.js'
  import { loggedUser, alert, storedSketches } from '../Store.js'
  import { getVotes, toObjFromId } from '../utils/Utils.js'
  import Clap from '../assets/clap.svg'
  import Heart from '../assets/heart.svg'
  import Okay from '../assets/okay.svg'
  import Edit from '../assets/edit.svg'
  import ProfilePicture from '../components/ProfilePicture.svelte'

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
    storedSketches.update(o => ({ ...o, ...sketchesById }))
  })

</script>

<style>
  #profile-view {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }

  #profile-card {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: auto;
    width: 100%;
  }

  #profile-info {
    display: flex;
    flex-direction: row;
  }

  #profile-img-wrapper {
    margin-right: 20px;
  }

  #down {
    margin-top: 50px;
    display: flex;
    flex-wrap: wrap;
  }

  #sidebar {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    width: auto;
    margin-right: 20px;
  }

  #gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, 224px);
    grid-column-gap: 25px;
    grid-row-gap: 25px;
    flex-grow: 1;
    margin-left: 20px;
  }

  span {
    vertical-align: top;
  }

  .gallery-selection {
    font-weight: bold;
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

  @media screen and (max-width: 534px) {
    #profile-view {
      flex-direction: column;
    }

    #profile-info {
      text-align: center;
      flex-direction: column;
    }

    #sidebar {
      flex-direction: row;
      flex-wrap: nowrap;
      width: 100%;
      justify-content: center;
      align-items: baseline;
      margin-right: 0;
    }

    .unavailable {
      display: none;
    }

    .gallery-selection {
      margin-right: 5px;
    }

    #profile-card {
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    #down {
      text-align: center;
    }

    #profile-img-wrapper {
      margin-right: 0;
    }

    #gallery {
      justify-content: center;
      margin-left: 0;
    }
  }
</style>

<section id='profile-view'>
  {#if user}
    <div id='profile-card'>
      <div id='profile-info'>
        <div id='profile-img-wrapper'>
          <ProfilePicture width='110px' height='110px' />
        </div>
        <h2>{user.username}</h2>
      </div>
      <div id='votes-wrapper'>
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
        <p class='gallery-selection selected'>Drawings</p>
        <p class='gallery-selection unavailable'>Votes</p>
        <p class='gallery-selection unavailable'>Collections</p>
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
