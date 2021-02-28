<script>
  import Router, { location } from 'svelte-spa-router'
  import Navbar from './components/Navbar.svelte'
  import LoginRegisterModal from './components/LoginRegisterModal.svelte'
  import Home from './routes/Home.svelte'
  import AlertBox from './components/AlertBox.svelte'
  import { onMount } from 'svelte'
  import { wrap } from 'svelte-spa-router/wrap'
  import { getCurrentSession, setCurrentSession } from './utils/Session.js'
  import { loggedUser, isLoginModalOpen, alert } from './Store.js'
  import { fly } from 'svelte/transition'

  const routes = {
    '/': Home,
    '/home': Home,
    '/user/:username': wrap({
      asyncComponent: () => import ('./routes/UserProfile.svelte')
    }),
    '/sketch/:id': wrap({
      asyncComponent: () => import ('./routes/Sketch.svelte')
    }),
    '/draw/': wrap({
      asyncComponent: () => import('./routes/Draw.svelte')
    })
  }

  onMount(() => {
    document.body.addEventListener('mousedown', () => {
      document.body.classList.add('using-mouse')
    })

    document.body.addEventListener('keydown', event => {
      event.keyCode === 9 && document.body.classList.remove('using-mouse')
    })

    loggedUser.set(null)
  })

  $: {
    $location
    document.body.scrollTop = 0
  }
</script>

<style>
  :global(:root) {
    --color-red: #FF4F38;
    --color-green: #38FFB3;
    --color-blue: #4F36FF;
    --color-grey: #F5F5F7;
    --color-pink: #FF38E8;
    --color-darkgrey: rgba(0, 0, 0, 0.5);
  }
  
  :global(*) {
    box-sizing: border-box;
  }

  :global(:focus) {
    outline: #08f auto 2px;
  }

  :global(body.using-mouse :focus) {
    outline: none;
  }

  #alert-box-wrapper {
    position: fixed;
    bottom: 20px;
    z-index: 100;
  }

  :global(.unavailable) {
    color: var(--color-darkgrey);
    cursor: not-allowed;
  } 

  :global(.selected) {
    background-color: var(--color-grey);
    padding: 10px;
    font-weight: bold;
    width: auto;
  }

  :global(.flex) {
    display: flex !important;
  }

  :global(.align-center) {
    align-items: center;
  }

  :global(.justify-center) {
    justify-content: center;
  }

  :global(.center-x) {
    left: 50%;
    transform: translateX(-50%);
  }

  :global(.center-y) {
    top: 50%;
    transform: translateY(-50%);
  }

  :global(.absolute-center) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  :global(html, body) {
    user-select: none;
    font-family: sans-serif;
    text-rendering: optimizeLegibility !important;
    -webkit-font-smoothing: antialiased !important;
    background-color: white;
    /* font-family: 'Jost'; */
    font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
    font-family: 'Jost';
    margin: 0;
    color: #1A202C;
  }

  :global(button, textarea, input) {
    font-family: inherit;
    border: 0px;
    font-size: 1.1em;
    border-radius: 3px;
  }

  :global(input) {
    border-radius: 3px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    font-size: 1.1em;
  }

  :global(button) {
    position: relative;
    padding: 10px;
    cursor: pointer;
    color: black;
    font-size: 0.9em;
    font-weight: bold;
  }

  :global(textarea) {
    padding: 10px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    text-align: left;
    resize: none;
  }

  :global(button:hover) {
    transform: scale(0.95);
  }

  :global(a) {
    color: inherit;
    text-decoration: none;
  }

  #body {
    padding: 20px 70px 20px 70px;
  }

  :global(.sketch) {
    cursor: pointer;
    display: inline-block;
    position: relative;
  }

  :global(.opacity-effect) {
    transition: opacity 0.1s;
  }

  :global(.opacity-effect:hover) {
    opacity: 0.75;
  }

  :global(.clickable) {
    cursor: pointer;
  }

  :global(.clickable:hover) {
    border-bottom: 1px solid white;
    padding-bottom: 2px;
  }

  @keyframes -global-jump {
    from { transform: scale(0.55) }
    to { transform: scale(1.0) }
  }

  :global(.jump-effect) {
    animation: jump 0.1s;
    animation-fill-mode: forwards;
  }

  :global(.link) {
    color: #255EB8;
    text-decoration: underline;
  }

  :global(.link:hover) {
    color: #003078;
  }

  :global(.gradient) {
    background: linear-gradient(90deg, #FA8BFF, #2BD2FF, #2BFF88);
    background-size: 400% 400%;
    animation: gradient-anim 15s ease infinite;
  }

  :global(.icon-jump) {
    transition: transform 0.3s;
  }

  :global(.icon-jump:hover) {
    transform: scale(0.9);
  }

  :global(.icon-jump:active) {
    transform: scale(1.2);
  }

  .colors {
    position: fixed;
    z-index: 99;
  }

  #color {
    top: 0;
    width: 100%;
    height: 10px;
  }

  :global(.todark) {
    animation: todark 0.5s;
    animation-fill-mode: forwards;
  }

  :global(.towhite) {
    animation: towhite 0.5s;
    animation-fill-mode: forwards;
  }

  @keyframes -global-todark {
    to { 
      background-color: #0A0913;
      color: white;
    }
  }

  @keyframes -global-towhite {
    from {
      background-color: #0A0913;
      color: white;
    }

    to { 
      background-color: white;
      color: #1A202C;
    }
  }

  @media screen and (max-width: 700px) {
    #body {
      padding: 20px;
      padding-top: 20px;
    }
  }
</style>

{#if $location !== '/draw'}
  <div id='color' class='gradient colors'></div>
{/if}

<Navbar />
<div id='body'>
  <div id='app'>
    <Router {routes} />
  </div>
</div>

{#if $isLoginModalOpen}
  <LoginRegisterModal />
{/if}

{#if $alert}
  <div transition:fly='{{ duration: 100 }}' id='alert-box-wrapper' class='center-x'>
    <AlertBox text={$alert.text} type={$alert.type} />
  </div>
{/if}
