<script>
  import { push } from 'svelte-spa-router'

  export let username
  export let points
  export let handleLogoffButtonClick
</script>

<style>
  #user-card {
    text-align: center;
    width: 200px;
  }

  #card {
    padding: 10px;
  }

  button {
    margin: 0 auto;
    display: block;
    width: 40%;
  }

  #see-profile-btn {
    display: block;
    background-color: #AEC6CF;
    margin-bottom: 10px;
  }

  #log-off-btn {
    background-color: #FF6961;
  }
</style>

<div id='user-card'>
  {username} ● {points}
  <div id='card' class='shadowed'>
    <button id='see-profile-btn' on:click={() => push(`/user/${username}`)} class='clickable shadowed'>profile</button>
    <button id='log-off-btn' on:click={handleLogoffButtonClick} class='clickable shadowed'>log-off</button>
  </div>
</div>
