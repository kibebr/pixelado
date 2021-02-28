<script>
  import { loggedUser, isLoginModalOpen } from '../Store.js'
  import { push, location } from 'svelte-spa-router'
  import Modal from '../components/Modal.svelte'
  import LoginRegisterModal from '../components/LoginRegisterModal.svelte'
  import MobileMenuModal from '../components/MobileMenuModal.svelte'
  import UserCard from '../components/UserCard.svelte'
  import { login, register } from '../services/SessionService.js'
  import { setCurrentSession } from '../utils/Session.js'
  import { fade } from 'svelte/transition'
  import Select from 'svelte-select'
      
  let shouldShowNav
  let isMobileModalOpen = false

  const handleBoxClick = () => {
    if (window.innerWidth >= 480) {
      push('/')
    } else {
      isMobileModalOpen = true
    }
  }

  $: shouldShowNav = true
</script>

<style>
  nav {
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

  #mobile-nav {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 3em;
  }

  #mobile-nav>span {
    display: block;
  }

  #nav-draw-btn {
    background-color: var(--color-pink);
  }

  #nav-draw-btn:hover {
    background-color: var(--color-pink);
    color: white;
  }

  #nav-login-btn {
    background-color: var(--color-blue);
  }

  @media screen and (max-width: 480px) {
    nav {
      padding: 20px;
    }

    #nav-box {
      top: 40px;
      left: 52%;
      transform: translateX(-50%);
    }
  }
</style>

{#if isMobileModalOpen}
  <Modal>
    <div id='mobile-nav'>
      <span>Home</span>
      <span on:click={() => isLoginModalOpen.set(true)}>Log-in</span>
    </div>
  </Modal>
{/if}

<nav class='flex justify-center align-center'>
  {#if $location !== '/draw'}
    <div id='nav-box' on:click={handleBoxClick}>
      <div id='nav-logo' class='gradient'></div>
      <span id='nav-title'>pixelado</span>
    </div>
  {/if}
  <div id='nav-btns'>
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
  </div>
</nav>
