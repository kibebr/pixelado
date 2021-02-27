<script>
  import ProfilePic from '../public/defaultprofilepic.jpg'

  export let width
  export let height
</script>

<style>
  img {
    border-radius: 50%;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    transition: opacity;
  }

  img:hover {
    opacity: 0.8;
  }
</style>

<img src={ProfilePic} style='width: {width}; height: {height};'alt='Default profile picture.' >
