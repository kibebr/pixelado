<script>
  import ProfilePicture from './ProfilePicture.svelte'
  import { push } from 'svelte-spa-router'

  export let author
  export let content
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
    font-weight: bold;
  }

  .profile-pic-wrapper {
    margin-right: 10px;
  }
</style>

<div class='comment-box'>
  <div class='comment-info-wrapper'>
    <div class='profile-pic-wrapper'>
      <ProfilePicture width='32px' height='32px' />
    </div>
    <a href='#/user/{author}'>
      <span>{author}</span>
    </a>
  </div>
  <div>
    <p>{content}</p>
  </div>
</div>
