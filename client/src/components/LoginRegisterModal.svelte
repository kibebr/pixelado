<script>
  import { jump } from '../utils/svelteCustomTransitions.js'
  import { loggedUser, isLoginModalOpen, alert } from '../Store.js'
  import { login as sessionLogin, register as sessionRegister} from '../services/SessionService.js'
  import Modal from './Modal.svelte'

  let isRegistering = false
  let rUsername
  let rEmail
  let rPassword
  let lUsername
  let lPassword

  const register = () => {
    sessionRegister(rUsername, rEmail, rPassword)
      .then(res => {
        alert.addAlert({ text: 'All good, you can now log-in with your account!', type: 'success' })
      })
      .catch(err => {
        alert.addAlert({ text: err, type: 'error' })
      })
  }

  const login = () => {
    sessionLogin(lUsername, lPassword)
      .then(user => {
        loggedUser.set(user)
        isLoginModalOpen.set(false)
        alert.addAlert({ text: `Hey ${lUsername}, you are now logged in!`, type: 'success' })
      })
      .catch(err => alert.addAlert({ text: err, type: 'error' }))
  }
</script>

<style>
  h2 {
    margin-top: 0;
    color: black;
    font-size: 2em;
  }

  button {
    padding: 7px;
    background-color: #4F36FF;
    color: white;
  }

  input {
    padding: 10px;
    margin: 0 auto;
    display: block;
  }

  form>* {
    margin-top: 20px;
  }

  .modal-close-button {
    font-weight: bold;
    padding: 8px;
    float: right;
    position: absolute;
    top: 10px;
    right: 10px;
    display: block;
    color: white;
    background-color: var(--color-red);
    overflow: visible;
  }

  #session-options {
    display: inline;
    text-align: left;
    font-size: 1em;
    margin-bottom: 20px;
  }
</style>

<Modal>
  <div id='content'>
    <button class='modal-close-button' on:click={() => isLoginModalOpen.set(false)}>X</button>
    {#if isRegistering}
      <h2>Register</h2>
      <form on:submit|preventDefault={register}>
        <input placeholder='Username' bind:value={rUsername}/>
        <input type='email' placeholder='E-mail' bind:value={rEmail}/>
        <input type='password' placeholder='Password' bind:value={rPassword}/>
        <button type='submit' id='register-button'>Register</button>
      </form>
      <div id='session-options'>
        <span class='clickable link' on:click={() => isRegistering = false}>Log-in instead</span>
      </div>
    {:else}
      <h2>Login</h2>
      <form on:submit|preventDefault={login}>
        <input placeholder='Username' bind:value={lUsername}/>
        <input type='password' placeholder='Password' bind:value={lPassword}/>
        <button type='submit' id='login-button'>Log-in</button>
      </form>
      <div id='session-options'>
        <span class='clickable link' on:click={() => isRegistering = true}>I want to create an account</span>
      </div>
    {/if}
  </div>
</Modal>
