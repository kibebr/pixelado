<script>
  import { push } from 'svelte-spa-router'

  export let author
  export let content
  export let date
</script>

<style>
  .comment-box {
    height: 120px;
    background: white;
    border-radius: 7px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    padding: 12px;
  }

  .comment-info-wrapper {
    display: flex;
    flex-direction: row;
    height: 35px;
    align-items: center;
  }

  h4 {
    margin-top: 0;
  }

  .profile-pic {
    width: 32px;
    height: 32px;
    background: pink;
    border-radius: 50%;
    margin-right: 10px;
  }
</style>

<div class='comment-box'>
  <div class='comment-info-wrapper'>
    <div class='profile-pic'></div>
    <span>{author}</span>
  </div>
  <div>
    <p>Oh man, that looks really nice! How did you make it?</p>
  </div>
</div>
