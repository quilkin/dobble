<script setup lang="ts">
import { ref, type Ref, reactive, onMounted, onBeforeMount, watch } from 'vue'
import PolyGraphic from './components/PolyGraphic.vue';
import { randInteger, Options, imageTypes } from './util'
import GameOptions from './components/GameOptions.vue'
import GameScore from './components/Timer.vue'
import ModalAlert from './components/ModalAlert.vue';
import { setupLibrary, svgImages } from './iconLibrary';
import JSConfetti from 'js-confetti'

let imageSize = 150
//alert(window.innerWidth);
if (window.innerWidth > 1000)
  imageSize = 200;
  if (window.innerWidth < 400) // iphone se
  imageSize = 120;

const listLengths = 55;
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXY2345678£$%&*@?:#=!{}][aefghrty'
const wordlist =
  'the, and, for, are, but, not, you, all, ear, any, can, had, her, was, fix,\
 fly, ace, act, pin, pot, rag, row, hen, bat, ink, bee, may, win, owl, fox,\
 one, our, out, day, get, has, him, his, how, man, new, now, old, see, two,\
 way, who, boy, did, its, let, put, say, she, too, use';
let wordArray = [''];

const currentMatch1 = ref(-1);
const currentMatch2 = ref(-1);

const score = ref(0);
const cardCount = ref(0);

const images1 = ref([''])
const images2 = ref([''])

const gameStarted = ref(false);
const isResultVisible = ref(false);
const resultWords = ref('');

const options = ref() 
const jsConfetti = new JSConfetti()


options.value = {
  [Options.randSize]: false,
  [Options.timer] : false,
  [Options.randAngle] : false,
  [Options.colours] : true,
  [Options.cardSize] : 8,
  [Options.numCards] : 20,
  [Options.numImages] : 26,
  [Options.wiggles] : false,
  [Options.showAnswer] : false,
  [Options.imageType] : imageTypes.icons
}

const topCard = ref();
const topCardRow = ref();
const distanceBetweenCards = ref();

onMounted(async() =>{
  // todo: seed random

  // check that we have established the lists correctly
  if (chars.length < listLengths) {
    console.error('insufficient letters in list: need ' + listLengths);
  }
  wordArray = wordlist.split(', ');
  if (wordArray.length < listLengths) {
    console.error('insufficient words in list: need ' + listLengths);
  }
  /* add images to the library */
  setupLibrary();
  if (svgImages.length < listLengths) {
    console.error('insufficient images in list: need ' + listLengths);
  }
  images1.value = [];
  images2.value = [];
  setCardImages(true);
  const randSeed = randInteger(Date.now()/1000);
  score.value = 0;
  cardCount.value = 0;
  decideInitialScore();


})


function randomImage() : string {
  
  let index;
  if (options.value.imageType == imageTypes.letters) {
    // randomly choose one of the first [Options.numImages] from the list of characters
    index = randInteger(options.value.numberOfImages);
  }
  else {

    // randomly choose one of the [Options.numImages] from the list of characters, starting choice from a random postion
    let startIndex = randInteger(listLengths - options.value.numberOfImages);

    index = randInteger(options.value.numberOfImages + startIndex,startIndex);
  }
  if (index >= listLengths) {
    console.error ('error, image index too high');
    return '?'
  }
  let image : string;
  if (options.value.imageType == imageTypes.letters)
    image = chars[index];
  else if (options.value.imageType == imageTypes.icons) {
    image = svgImages[index];
    if (image.length < 3)
      console.error('bad image');
  }
   
  else image = wordArray[index];
  
  return image;
}



function getDistanceBetweenCards() {
  const el1 = document.getElementById('topCard');
  const el2 = document.getElementById('bottomCard');

  if (el1 && el2) {
    
    const top1 = el1.offsetTop;
    const top2 = el2.offsetTop;
    distanceBetweenCards.value = top2-top1;
    }
}

function decideInitialScore() {
  score.value = 0;
  score.value += options.value.numberOfImages/5;
  score.value += options.value.cardSize;
  score.value += options.value.randomAngle? 5 : 0;
  score.value += options.value.randomSized? 5 : 0;
  score.value += options.value.multiColour? 10 : 0;
  score.value += options.value.wiggles? 5 : 0;
 }
 
function updateScore() {
  score.value += options.value.cardSize;
  score.value += options.value.randomAngle? 1: 0;
  score.value += options.value.randomSized? 1 : 0;
  score.value += options.value.multiColour? 2 : 0;
  score.value += options.value.wiggles? 1 : 0;
 }

function setCardImages(newGame: boolean) {

  // images must be all different
  // except one and only one must be in both cards

  if (newGame)  {
    images2.value = [];
    // new set for card 2
     // let maxtries = options.value.numberOfImages;
    let maxtries = listLengths;
    for (let n=0; n < options.value.cardSize; ) {
      let rand = randomImage();
      if (images2.value.includes(rand)===false && images1.value.includes(rand)===false) {
        images2.value.push(rand);
        n++;
      }
      if (--maxtries <= 0)  {
        console.log('insufficient images available for randomising');
        break;
      }
    }
    decideInitialScore();
  }
  else {
    // correct image just clicked - copy old card 1 to card 2
    images2.value = images1.value;
  }

  images1.value = []

  //  always a fresh set for card 1
 // let maxtries = options.value.numberOfImages;
 let maxtries = listLengths;
  for (let n=0; n < options.value.cardSize; ) {
    let rand = randomImage();
    if (images1.value.includes(rand)===false && images2.value.includes(rand)===false ) {
      images1.value.push(rand);
      n++;
    }
    if (--maxtries <= 0)  {
        console.log('insufficient images available for randomising');
        break;
      }
  }
  
  // now have all different images
  // one and only one must match image from card 1
  // so randomly copy one from set 2 to set 1
  currentMatch1.value = randInteger(options.value.cardSize);
  currentMatch2.value = randInteger(options.value.cardSize);
  images1.value[currentMatch1.value] = images2.value[currentMatch2.value];

  
}
function showResult() {
  jsConfetti.addConfetti({  emojis: [ '😎', '😇', '😮', '🙂','😃']})    
  gameStarted.value = false;
  resultWords.value = `Success! ${cardCount.value} cards matched with a score of ${score.value}`;
  isResultVisible.value = true;
  cardCount.value = 0;

}
function closeResult()
{
  isResultVisible.value = false;
  jsConfetti.clearCanvas();
  decideInitialScore();
}
function failed() {
  // show answer for a few seconds then stop game
  options.value.showAnswer = true;
  window.setTimeout( ()=>{
    gameStarted.value = false;
    resultWords.value = `Sorry 😢 you ran out of time!`;
    isResultVisible.value = true;
    cardCount.value = 0;
    options.value.showAnswer = false;
    decideInitialScore();
    }, 4000)
}
function moveCards() {
  getDistanceBetweenCards();
  // move top card down and replace it with new one appearing from left
  let animation = moveTopCardDown();
  if (animation) {
    animation.finished.then(() => {
 
        if (++cardCount.value >= options.value.numCards) {
          showResult();
          return;
        }
        moveNewCardAcross();
        setCardImages(false);
    });
  }
  updateScore();

}
//let currentAnimation: Animation;
function moveTopCardDown() {
  let animation;
 
  if (topCardRow.value) {
    let el = topCardRow.value.$el ;
    animation = el.animate(
      [
        { transform: "translateY(0)"},
        { transform: `translateY(${distanceBetweenCards.value/4}px) rotate(90deg)`},
        { transform: `translateY(${distanceBetweenCards.value/2}px) rotate(180deg)`},
        { transform: `translateY(${distanceBetweenCards.value*3/4}px) rotate(270deg)`},
        { transform: `translateY(${distanceBetweenCards.value}px) rotate(0deg)`},
      ],
      { 
        duration: 500 ,
        easing: "ease-in-out",
      }
    )
  }
  return animation;
}
function moveNewCardAcross() {
  if (topCard.value) {
    let el = topCard.value.$el;

    el.animate(
      [
        { transform: `translateX(${-imageSize*2}px) translateY(${-imageSize}px)`},
        { transform: "translateX(0) translateY(0) ", offset: 0.8},
        { transform: `translateX(0) translateY(${-imageSize/2}px) `, offset: 0.85},
        { transform: "translateX(0) translateY(0) ", offset: 0.9},
        { transform: `translateX(0) translateY(${-imageSize/4}px) `, offset: 0.95},
        { transform: "translateX(0) translateY(0) ", offset: 1}
      ], 
      { 
        duration: 500 ,
        easing: "ease-in-out",
      }
    )
  }

}
function testMatch1(image : string) {
    // test  to see if image in card 1 is the duplicated one
    if (image === images1.value[currentMatch1.value])
    {
        moveCards();
    }
    else  
      --score.value ;
}
function testMatch2(image :string) {
    // test  to see if image in card 2 is the duplicated one
    if (image === images2.value[currentMatch2.value])
    {
      moveCards();
    }
    else  
      --score.value ;
}

function startGame() {

  gameStarted.value = true;
  cardCount.value = 0;
}


</script>


<template>
  <v-app>
    <v-main>
      <v-container >
        <v-responsive class="align-center">
          <v-row  ref="topCardRow">
            <v-col class="mb-0">
              <div v-if="gameStarted" id="topCard">
                <svg  :width="imageSize*2" :height="imageSize*2">
                  <PolyGraphic  ref="topCard"
                    :options = "options"
                    :images="images1"
                    :imageSize="imageSize"
                    :answer="currentMatch1"
                      @click-image="testMatch1"
                    ></PolyGraphic>
                </svg>
              </div>
              <game-options v-else
                v-model = "options"
                @change-images="setCardImages(true);"
                @done-setup = "startGame"
              >
              </game-options>
              <game-score  
                v-model = "score"
                :card-count="cardCount"
                :options = "options"
                :started = "gameStarted"
                @failed="failed"
                >
              </game-score>
            </v-col>
          <!-- </v-row>
          <v-row> -->
            <v-col class="pb-n2">
              <!-- <p>&nbsp;</p> -->
              <div id="bottomCard">
                <svg :width="imageSize*2" :height="imageSize*2">
                  <PolyGraphic  
                    :options = "options"
                    :images="images2"
                    :imageSize="imageSize"
                    :answer="currentMatch2"
                    @click-image="testMatch2"
                    ></PolyGraphic>
                </svg>
              </div>
              <v-btn v-if="gameStarted" variant="tonal" color="blue"  @click="gameStarted= false">Stop/Restart</v-btn>
            
            </v-col>
          </v-row>
        </v-responsive>
      </v-container>
      <ModalAlert v-show="isResultVisible" @close-modal="closeResult()" >
          <template v-slot:body>{{ resultWords }}</template>
      </ModalAlert>
    </v-main>
  </v-app>
</template>


