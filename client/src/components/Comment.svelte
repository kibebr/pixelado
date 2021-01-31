<script>
  import { push } from 'svelte-spa-router'

  export let author
  export let content
  export let date
</script>

<style>
  .comment-box {
    height: 120px;
    outline: 1px solid red;
  }

  .profile-pic-wrapper {
    height: 100%;
    width: 40px;
  }

  h4 {
    margin-top: 0;
  }

  .profile-pic {
    width: 16px;
    height: 16px;
  }
</style>

<div class='comment-box flex'>
  <div class='profile-pic-wrapper'>
    <div class='profile-pic'>
      test
    </div>
  </div>
  <div>
    <h4>{author}</h4>
    <p>{content}</p>
  </div>
</div>
