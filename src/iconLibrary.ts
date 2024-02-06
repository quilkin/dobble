
export let svgImages = [] as string[];

export  function setupLibrary() {
  
    for (let file=1; file < 100; file++) {
        try {
            const img =   new URL(`/src/assets/svg/svg${file}.svg`, import.meta.url).href;
            if (img.includes('undefined') === false)
                svgImages.push(img);
            else    
                break;
        }
        catch(e) {
            break;
        }
    }
   // console.log('images: ' + svgImages);

}