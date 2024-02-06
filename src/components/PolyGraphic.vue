<script setup lang="ts">
import { computed, onUpdated } from 'vue'
import SegmentImage from './SegmentImage.vue'
import { type image, Options } from '../util'

const emit = defineEmits(['clickImage'])

const props =defineProps<{
  images: string[],
  imageSize: number,
  options : {[key in Options]: number | boolean},
  // index to correct image to click
  answer: number;
}>()

function submitImage(imageID : number)
{
  // just pass up through to top level
  emit("clickImage",imageID);
}

// onUpdated(() =>{
//     console.log(props.answer)
// })

</script>

<template>
  <g>
    <circle  :cx="props.imageSize" :cy="props.imageSize" :r="props.imageSize" stroke="green" stroke-width="1" fill="white"></circle>

    <!-- one image in centre, circle must respond to clicks -->
    <!-- <circle id="centre" :cx="props.imageSize" :cy="props.imageSize" :r="props.imageSize/3"  fill="white"   @click="emit('clickImage',images[0])"></circle> -->
    
    <segment-image  
      v-for="(image, index) in images"
      :options = "options"
      :size = "imageSize"
      :img="image"
      :index="index"
      :answer = "index===props.answer"
      :segments="images.length-1"
      @click-image=submitImage
    >
    </segment-image>

  </g>

   
</template>

<style>

#outer {
    stroke: rgb(226, 230, 11);
    stroke-width: 2px;
  }
  /* #centre:hover { 
      fill: rgb(74, 109, 38);
      fill-opacity: 0.2;
      cursor: pointer;
      
  } */

</style>