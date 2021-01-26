<script>
  import SpinningSquare from '../components/SpinningSquare.svelte'
  import { push } from 'svelte-spa-router'
  import { jump } from '../utils/svelteCustomTransitions.js'
  import { storedSketches, loggedUser, alert } from '../Store.js'
  import { createCanvas, setCanvasBoxes } from '../utils/Canvas.js'
  import { fetchSketchWithId, sendVote, submitComment } from '../services/SketchService.js'
  import { getVotes } from '../utils/Utils.js'
  import { onMount } from 'svelte'
  import Comment from '../components/Comment.svelte'
  import Clap from '../assets/clap.svg'
  import Heart from '../assets/heart.svg'
  import Okay from '../assets/okay.svg'

  export let params = {}

  let canvas
  let comment = ''
  let totalVotes = {
    claps: 0,
    perfect: 0,
    love: 0,
  }

  onMount(async () => {
    if (!$storedSketches[params.id]) {
      const sketch = await fetchSketchWithId(params.id)
      storedSketches.update(o => ({ [params.id]: sketch, ...o }))
    }
  })

  const handleSubmitComment = () => {
    if (!$loggedUser) {
      alert.addAlert({
        text: 'You have to be logged-in to submit your comment!',
        type: 'error'
      })
    } else if (comment.length === 0 || comment.length > 300) {
      alert.addAlert({
        text: 'Your comment cannot be longer than 300 characters or empty!',
        type: 'error'
      })
    } else {
      submitComment({
        sketchId: params.id,
        comment: { 
          content: comment, 
          date: '1010' 
        },
        token: $loggedUser.token
      })
        .then(() => {
          alert.addAlert({
            text: 'Comment submitted!',
            type: 'success'
          })
        })
        .catch(err => {
          alert.addAlert({
            text: err,
            type: 'error'
          })
        })
    }
  }

  const handleAddVote = type => {
    if (!$loggedUser) {
      alert.addAlert({ text: 'Oops, you have to be logged in to vote!', type: 'error' })
    } else {
      sendVote(params.id, type, $loggedUser.token)
        .then(() => {
          
        })
        .catch(err => {
          alert.addAlert({ text: err, type: 'error' })
        })
    }
  }
  $: {
    if ($storedSketches[params.id] && canvas) {
      setCanvasBoxes({
        size: $storedSketches[params.id].size.w,
        boxWidth: canvas.width / $storedSketches[params.id].size.w,
        boxHeight: canvas.height / $storedSketches[params.id].size.h
      })($storedSketches[params.id].boxes)(canvas)
    }
  }
</script>

<style>
  #sketch-view {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    margin: 0 auto;
  }

  #sketch-wrapper {
    flex: 1;
    text-align: center;
    justify-content: center;
    width: 100%;
  }

  #sketch-comments {
    text-align: left;
  }

  #votes {
    margin-top: 20px;
    display: block;
  }

  .clap-icon {
    display: inline-block;
    width: 60px;
    height: 60px;
    padding: 8px;
    cursor: pointer;
    font-weight: bold;
  }

  #box {
    margin: 0 auto;
    margin-top: -5px;
    width: 480px;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    background-color: #FBFBFB;
  }

  textarea {
    width: 100%;
  }

  h2 {
    font-size: 2em;
  }

  #submit-comment-btn {
    display: flex;
    margin: 0 auto;
    margin-top: 20px;
    background-color: var(--color-green);
  }

  #sketch-comments {
    margin-top: 20px;
  }

  .comment-wrapper {
    position: relative;
    margin: 0 auto;
    margin-top: 20px;
  }
  .small {
    font-size: 0.4em;
    color: rgba(0, 0, 0, 0.4);
  }
</style>

<div id='sketch-view'>
  <div id='sketch-wrapper'>
    {#if $storedSketches[params.id]}
      {$storedSketches[params.id].author}
      <h2 id='sketch-title'>{$storedSketches[params.id].title}</h2>
      <div in:jump='{{ duration: 60 }}'>
        <canvas width=576 height=576 bind:this={canvas}></canvas>
      </div>
      <div id='box'>
        <div id='votes'>
          <div role='button' class='clap-icon icon-jump' on:click={() => handleAddVote('claps')}>
            {@html Clap} 
            {$storedSketches[params.id].votes.claps && getVotes($storedSketches[params.id].votes.claps) || 0}
          </div>
          <div role='button' class='clap-icon icon-jump' on:click={() => handleAddVote('hearts')}>
            {@html Heart} 
            {$storedSketches[params.id].votes.hearts && getVotes($storedSketches[params.id].votes.hearts) || 0}
          </div>
          <div role='button' class='clap-icon icon-jump' on:click={() => handleAddVote('okays')}>
            {@html Okay} 
            {$storedSketches[params.id].votes.okays && getVotes($storedSketches[params.id].votes.okays) || 0}
          </div>
        </div>
        <div id='sketch-comments'>
          <div>
            <textarea bind:value={comment} placeholder="How do you like {$storedSketches[params.id].author}'s drawing?" />
            <button id='submit-comment-btn' on:click={handleSubmitComment}>Submit</button>
          </div>
          <h3>Comments <span class='small'>{$storedSketches[params.id].comments.length} COMMENT(S)</span></h3>
          {#each $storedSketches[params.id].comments as comment}
            <div class='comment-wrapper'>
              <Comment author={comment.author} content={comment.content} date={comment.date} />
            </div>
          {/each}
        </div>
      </div>
      {:else}
        <div class='absolute-center'>
          <SpinningSquare />
        </div>
    {/if}
  </div>
</div>
