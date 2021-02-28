<script>
  import SpinningSquare from '../components/SpinningSquare.svelte'
  import SketchContainer from '../components/SketchContainer.svelte'
  import { onMount } from 'svelte'
  import { fetchSketches } from '../services/SketchService.js'
  import { storedSketches } from '../Store.js'
  import Select from 'svelte-select'
  import { toObjFromId } from '../utils/Utils.js'

  let paginationRange = [0, 10]
  let sketches = null

  const filterOptions = [
    { value: 'popular', label: 'Popular' },
    { value: 'new', label: 'New' },
  ]
  let selectedFilter = 'popular'

  onMount(async () => {
    sketches = await fetchSketches(
      'popular',
      [0, 10]
    )
    const sketchesById = toObjFromId(sketches)

    console.log(sketchesById)
    storedSketches.update(s => ({ ...s, ...sketchesById }))
    console.log($storedSketches)
  })

  const selectFilter = async newFilter => {
    selectedFilter = newFilter
    sketches = await fetchSketches(
      selectedFilter,
      [0, 10]
    )
  }
</script>

<style>
  #bar {
    margin-bottom: 40px;
  }

  .bar-selection-text {
    font-size: 15px;
    padding: 10px;
    border-radius: 3px;
    margin-right: 25px;
  }

  .bar-div {
    flex: 1;
    display: flex;
    align-items: center;
  }

  #left {
    justify-content: flex-start;
    --padding: 200px;
    --borderFocusColor: var(--color-grey);
    --background: #FEFEFE;
    --itemIsActiveBG: var(--color-blue);
  }

  #center {
    display: flex;
    flex-direction: flex-row;
    flex-wrap: no-wrap;
    flex: 1;
    flex-shrink: 0;
    justify-content: center;
  }

  #right {
    justify-content: flex-end;
  }

  #sketch-gallery {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, 224px);
    grid-auto-flow: dense;
    grid-column-gap: 25px;
    grid-row-gap: 50px;
  }

  @media only screen and (max-width: 541px) {
    #bar {
      margin-bottom: 0px !important;
    }

    #left {
      justify-content: center;
    }

    #right {
      display: none;
    }

    #center {
      display: none;
    }

    #sketch-gallery {
      padding-top: 50px;
      justify-content: center;
    }
  }
</style>

<div id='home-view'>
  <div id='bar' class='flex align-center justify-center'>
    <div id='left' class='bar-div'>
      <Select 
         items={[{
         value: 'popular',
         label: 'Popular'
         }, {
         value: 'new',
         label: 'New'
         }]} 
         selectedValue={{ value: 'popular', label: 'Popular' }}
         isSearchable={false}
         isClearable={false}
         on:select={({ detail }) => selectFilter(detail.value)}></Select>
    </div>
    <div id='center' class='bar-div'>
      <div>
        <span class='bar-selection-text selected'>Drawings</span>
      </div>
    </div>
    <div id='right' class='bar-div'>

    </div>
  </div>
  <section id='sketch-gallery'>
    {#if sketches}
      {#each sketches as sketch}
        <SketchContainer sketch={sketch} />
      {/each}
    {:else}
      <div class='absolute-center'>
        <SpinningSquare />
      </div>
    {/if}
  </section>
</div>
