<script>
  import { getRandomPastelColor } from '../utils/Colors.js'
  import { push } from 'svelte-spa-router'

  export let author
  export let content
  export let date
</script>

<style>
  .comment-box {
    text-align: left;
    padding: 15px;
    border-radius: 5px;
    transition: transform 0.05s;
    border: 2px solid rgba(0, 0, 0, 0.1);
    background-color: white;
  }

  .content {
    font-size: 1em;
  }

  .comment-box:hover {
    transform: scale(1.03);
  }

  .comment-author {
    font-size: 1.4em;
    display: block;
    font-weight: bold;
    margin-bottom: 10px;
  }
</style>

<div class='comment-box'>
  <a href='#/user/{author}'><span class='comment-author'>{author}</span></a>
  <span class='content'>{content}</span>
</div>
