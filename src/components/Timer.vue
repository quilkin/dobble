<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed} from 'vue'
import {  Options} from '../util'


const emit = defineEmits(['failed'])
const score = defineModel<number>();

const props = defineProps<{
  started : boolean
  cardCount : number
  options : {[key in Options]: number | boolean}
}>()

let timer:  number;

onMounted(() =>{
    window.clearInterval(timer);
    timer = window.setInterval(gameTimer, 1000);
    //scoreVal.value = props.score;
})

onBeforeUnmount(() =>{
    window.clearInterval(timer);
})

function gameTimer() {
    if (props.started && score.value) {
            --score.value;
            if (score.value < 10)
                bounce();
            if (score.value <= 1)
                emit('failed');
    }
}
const displayScore = computed(()=>{
    if (score.value)
        return Math.round(score.value);
    return -1;
})
const displayColour = computed(()=>{

    if (score.value)
        return (score.value<10? 'red':'blue');
    return 'grey';
})
   
function bounce() {

let el = document.getElementById('chip');
if (!el) return;

    el.animate(
      [
        { transform: `translateX(0) translateY(-20px)`},
        { transform: "translateX(0) translateY(0) "},
        { transform: `translateX(0) translateY(-10px) `},
        { transform: "translateX(0) translateY(0) "},
        { transform: `translateX(0) translateY(-15px) `},
        { transform: "translateX(0) translateY(0) "}
      ], 
      { 
        duration: 300 ,
        easing: "ease-in-out",
      }
    )
}

</script>

<template>
    <v-chip  >Cards Matched: {{props.cardCount}} / {{props.options.numCards}}</v-chip>
    <v-chip  id="chip" v-if="props.started" :color="displayColour">Score: {{displayScore}} </v-chip>
    <v-chip  v-else>Starting score: {{displayScore}} </v-chip>

</template>