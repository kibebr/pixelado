<script>
  import { fade } from 'svelte/transition'
  import { jump } from '../utils/svelteCustomTransitions.js'

  export let handleCloseButtonClick
  export let messages
</script>

<style>
  .modal {
    background-color: rgba(0, 0, 0, 0.7);
    bottom:0;
    left:0;
    position:fixed;
    right:0;
    top:0; 
    color: white;
    overflow: hidden;
    z-index: 100;
  }

  .modal-content {
    text-align: center;
    background-color: white;
    height: 75%;
    position: relative;
    max-height: 57em;
    max-width: 66em;
    width: 60%;
    -webkit-overflow-scrolling: touch;
    margin: 0 auto;
    margin-top: 100px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: black;
  }

  @media screen and (max-width: 480px) {
    .modal-content {
      height: 100%;
      margin: 0 auto;
      width: 100%;
    }
  }
</style>

<div class='modal' transition:jump='{{ duration: 30 }}'>
  <div class='modal-content shadowed'>
    <slot></slot>
  </div>
</div>
