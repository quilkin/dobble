<script setup lang="ts">
import { onMounted } from 'vue';
import { Options, imageTypes} from '../util'
const emit = defineEmits(['doneSetup','changeImages'])
const options = defineModel<{[key in Options]: any}>()

function minNumberImages() : number{
    let size = Number(options.value?.cardSize);
    return size * 3;
}


</script>

<template>
    <v-container class="pa-0" v-if="options"
       style="width: 350px; height: 400px; padding: 0px;  position: relative;">
        <v-card-title>Instructions</v-card-title>
        <v-card-text class="pa-0">
            Match the image from one card with the image on the other one.
            Depending on your chosen options, images may be different sizes, colours or orientations - but the shapes will be the same!
            They may also wiggle now and again...
        </v-card-text>
        <v-form   @submit = "emit('doneSetup')" >
          <v-row>
            <v-col class="pl-0 pr-0">
                <input type="checkbox" id="checkboxSizes" v-model="options.randomSized"   @change="emit('changeImages')" />
                &nbsp;
                <label for="checkboxSizes">Random sizes</label>
                <p></p>
                <input type="checkbox" id="checkboxAngles" v-model="options.randomAngle"  @change="emit('changeImages')"/>
                &nbsp;
                <label for="checkboxAngles">Random angles</label>

            </v-col>
            <v-col  class="pl-0 pr-0">

            <input type="checkbox" id="checkboxWiggle" v-model="options.wiggles"  @change="emit('changeImages')"/>
            &nbsp;
            <label for="checkboxWiggle">Wiggle</label>
            <p></p>
                <div v-if="options.imageType != imageTypes.icons">
                    <input type="checkbox" id="checkboxColours" v-model="options.multiColour"   @change="emit('changeImages')"/>
                    &nbsp;
                    <label for="checkboxColours">Multi-coloured</label>
                </div>

        </v-col>
        </v-row>
            <p></p>

            <label >Type of images: </label>
            <input type="radio" id="one" :value="imageTypes.letters" v-model="options.imageType"  @change="emit('changeImages')"/>
            <label for="one">Letters</label>
            &nbsp;
            <input type="radio" id="two" :value="imageTypes.words" v-model="options.imageType"  @change="emit('changeImages')"/>
            <label for="two">Words</label>
            &nbsp;
            <input type="radio" id="three" :value="imageTypes.icons" v-model="options.imageType"  @change="emit('changeImages')"/>
            <label for="two">Pictures</label>
            <p></p>
            <p></p>

            <label for="numCardsSlider">Cards per pack:&nbsp;</label>
            <input type="range"  style="width:175px;" id="numCardsSlider"
             v-model.number="options.numCards"
             min="10" max="100" step="1" 
             @change="emit('changeImages')"
             >
             <label>&nbsp;{{options.numCards }}</label>

             <v-spacer></v-spacer>
            <label for="cardSizeSlider">Images per card:&nbsp;</label>
            <input type="range"  style="width:175px;" id="cardSizeSlider"
             v-model.number="options.cardSize"
             @change="emit('changeImages')"
             min="5" max="10" step="1"
             >
             <label>&nbsp;{{ options.cardSize }}</label>
            
             <v-spacer></v-spacer>
            <label for="numImagesSlider">No. of images in set:&nbsp;</label>
            <input type="range"  style="width:175px;" id="numImagesSlider"
             v-model.number="options.numberOfImages"
             @change="emit('changeImages')"
             :min="minNumberImages()" max="55" step="1"
             >
             <label>&nbsp;{{ options.numberOfImages }}</label>

            <v-btn  type="submit" variant="tonal"  color="blue" block class="mt-2">Start Game</v-btn>
        </v-form>
    </v-container>
</template>

