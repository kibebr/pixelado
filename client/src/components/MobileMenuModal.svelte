<script>
  import Modal from './Modal.svelte'
  import { push } from 'svelte-spa-router'

  export let handleLoginButtonClick
</script>

<style>
  span {
    margin-bottom: 20px;
    font-weight: 700;
    font-size: 3em;
    display: block;
    color: black;
  }
</style>

<Modal>
  <div id='content' class='absolute-center'>
    <span>Log-in</span>
    <span on:click={() => push('/draw')}>Draw</span>
  </div>
</Modal>
