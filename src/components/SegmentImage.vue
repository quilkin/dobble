<script setup lang="ts">
import { computed, onMounted , onBeforeUnmount, onUpdated, ref} from 'vue'
import {  randInteger,type image , Options, imageTypes} from '../util'

const emit = defineEmits(['clickImage'])

const props = defineProps<{
  img: string,
  size: number
  index: number,
  segments: number,
    // is this the correct image to click?
  answer: boolean;
  options : {[key in Options]: number | boolean}
}>()

let timer:  number;
const doesWiggle = ref(false);


onMounted(() =>{

    window.clearInterval(timer);
    if (props.options.wiggles) {
      // each item wiggles every 10 secs but starting at different times
      window.setTimeout( ()=>{
        timer = window.setInterval(wiggle, 10000);
      },randInteger(10000));
    }
  }
)
// onUpdated(() =>{
//     console.log(props.answer)
// })
onBeforeUnmount(() =>{
    window.clearInterval(timer);
})

const showAnswer = computed(() => {
  return props.answer && props.options.showAnswer;
})

function wiggle() {
  doesWiggle.value = true;
  window.setTimeout( ()=>{
    doesWiggle.value = false;
  },1000);
}

const colours = ['blue','black','red','orange','green','purple', 'brown']

/**
 * find position of origin of image (svg letter, word or image)
 * 
 */
const point = computed(() =>
{
  let p ;
  if (props.index === 0) {//index 0 is centre image
    p = {x:props.size, y:props.size};
  }
  else
  {
    // calculate depending on segment it's in
    p = valueToPoint(props.size, props.index, props.segments);
  }
  // p now represents the centre of the image
  if (props.options.imageType == imageTypes.words){
    // origin of text is bottom-left, so need to move it down and left a bit
      p.x -= imageSize()*2/3;    // size being approx height of one char
      p.y += imageSize()/4;
  }
  else if (props.options.imageType == imageTypes.icons){
    // origin of image is top-left, so need to move it up and left a bit
    p.x -= imageSize()/2;    
    p.y -= imageSize()/2;
  }
  else {  //letters
    p.x -= imageSize()/3;    // size being approx height of one char
    p.y += imageSize()/3;
  }
  return p;
})

/**
 * find position to rotate around - i.e. centre of image. 
 */
const centrePoint = computed(() =>
{
  let p;
  if (props.index === 0) {//index 0 is centre image
    p = {x:props.size, y:props.size};
  }
  else
  {
    // calculate depending on segment it's in
    p = valueToPoint(props.size, props.index, props.segments);
  }
  return p;

})

/**
 * find position of svg graphic (text or image)
 * @param size : radius of circle
 * @param index : which segemnt it's in
 * @param total : number of segments
 * @returns coords{x,y}
 */
 function valueToPoint(size: number,  index:number, total: number ) {
  
  const x = 0
  let y = -size * 0.7;  // 70% of distance from centre to perimeter of circle

  // find angle to centre of segment
  const angle = ((Math.PI * 2) / total) * (index - 0.5)
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  var tx = x * cos - y * sin + size;
  var ty = x * sin + y * cos + size;

  return {
    x: tx,
    y: ty
  }
}
function rotate() {
  //if (props.options.randomAngle && props.index > 0) // don't rotate centre letter
  if (props.options.randomAngle ) 
    return randInteger(360);
  return 0;
}
function transform(point: { x: number; y: number; }) {
  return `rotate(${rotate()},${point.x},${point.y})`
  //return `rotate(${rotate()})`
}

/**
 * determine a rough size for the image; 25-30% of the circle radius shoud be OK
 */
function imageSize() {
  let size;
  if (props.options.randomSized)
    size = props.size*2/9 + randInteger(props.size/4 );
  else 
    size = props.size/3 ;
  // words need to be a bit smaller to fit without going over the edge (esp. when rotated)
  if (props.options.imageType === imageTypes.words)
    size = size * 0.7;
  return size;
}
function colour() {
  let index = 0;
  if (props.options.multiColour)
    index = randInteger(colours.length);
  return colours[index];
}
//let url: string;
function label(): string {
  // let svg = props.img;
  // let blob = new Blob([svg], {type: 'image/svg+xml'});
  // url = URL.createObjectURL(blob);
  // let image = document.createElement('img');
  // return url;
  // image.src = url;
  // image.addEventListener('load', () => URL.revokeObjectURL(url), {once: true});

   return props.img;
}
// function onImageLoad() {
//   URL.revokeObjectURL(url), {once: true}
// }
function isImage() {
  //will be a URL if it's an image
  return props.img.length > 3;
}

</script>

<template>

<image v-if="isImage()"  
      :class="{ wiggle: doesWiggle, highlight: showAnswer}"
      :href="props.img"
      :height="imageSize()" 
      :transform="transform(centrePoint)"
      @click="emit('clickImage',props.img)"
      class="wheelImage"
      :x="point.x"
      :y="point.y"
/>

    <text v-else
      :class="{ wiggle: doesWiggle, highlight: showAnswer }"
      :font-size="imageSize()"
      :transform="transform(centrePoint)"
      :fill= "colour()"
      style = "background-color: aquamarine;"
      @click="emit('clickImage',props.img)"
      class="wheeltext"
      :x="point.x"
      :y="point.y">
     {{ props.img }}
  </text>
</template>

<style scoped>


.wiggle {
    animation: wiggle .1s alternate 6 ease-in-out;
  }
@keyframes wiggle {
  from {
    translate: -10px 0;
  }
  to {
    translate: 10px 0;
  }
}
.highlight{
    animation: hl .4s infinite alternate ease-in-out;
  }
@keyframes hl {
  0% {
        transform: scale(1.2,0.8);
    }
  100% {
        transform: scale(0.8,1.2);
    }
}

.wheeltext {

    font-weight: bold;
    font-family: Arial, Helvetica, sans-serif;
    cursor: pointer;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
    
}
.wheelImage {
  cursor: pointer;
  -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
}
.wheeltext:hover {
     cursor: pointer;
    
}
</style>