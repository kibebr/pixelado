<script>
  import Alert from '../assets/alert.svg'

  export let text
  export let type

  const getColorForType = () => {
    switch (type) {
      case 'error':
        return '#FF4F38'
      case 'success':
        return '#38FF6A'
    }
  }
</script>

<style>
  #alert-box {
    width: auto;
    height: auto;
    padding: 15px;
    border-radius: 4px;
  }

  #alert-title {
    display: block;
    font-weight: bold;
    color: black;
    font-size: 1em;
  }

  #alert-text {
    color: black;
    font-size: 1em;
  }

  .icon {
    position: absolute;
    display: inline-block;
    width: 24px;
    height: 24px;
  }
</style>

<div id='alert-box' style='background-color: {getColorForType()}'>
  {#if type === 'error'}
    <span id='alert-title'>Oops, there was a problem!</span>
  {:else}
    <span id='alert-title'>Success!</span>
  {/if}
  <span id='alert-text'>{text}</span>
</div>
