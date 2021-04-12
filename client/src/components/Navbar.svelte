<script>
  import { loggedUser, isLoginModalOpen } from '../Store.js'
  import { push, location } from 'svelte-spa-router'
  import Modal from '../components/Modal.svelte'
  import { fade } from 'svelte/transition'
</script>

<style>
  header {
    margin-top: 10px;
    padding-right: 70px;
    padding-left: 70px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 80px;
    z-index: 2;
    text-align: right;
    background-color: var(--color-grey);
  }

  button {
    color: white;
  }

  #nav-title {
    display: inline-block;
    transform: translateY(-7px);
    margin-left: 0;
  }

  #nav-btns {
    right: 70px;
  }

  span {
    font-weight: bold;
    cursor: pointer;
    margin-left: 20px;
  }

  #nav-logo {
    width: 24px;
    height: 24px;
    display: inline-block;
  }

  #nav-box {
    left: 70px;
    cursor: pointer;
  }

  #nav-draw-btn {
    background-color: var(--color-darkgrey);
  }

  #nav-login-btn {
    background-color: var(--color-darkgrey);
  }

  @media screen and (max-width: 480px) {
    nav {
      padding: 20px;
    }
  }
</style>

<header class='flex justify-center align-center'>
  {#if $location !== '/draw'}
    <a href='/'>
      <div id='nav-box'>
        <div id='nav-logo' class='gradient'></div>
        <span id='nav-title'>pixelado</span>
      </div>
    </a>
  {/if}
  <nav id='nav-btns'>
    {#if $location !== '/draw'}
      <a href='#/draw'>
        <button id='nav-draw-btn' transition:fade='{{ duration: 100 }}'>Draw</button>
      </a>
    {/if}
    {#if !$loggedUser}
      <button id='nav-login-btn' on:click={() => isLoginModalOpen.set(true)}>Log-in</button>
    {:else}
      <a href='#/user/{$loggedUser.username}'>
        <span>{$loggedUser.username}</span>
      </a>
    {/if}
  </nav>
</header>
