const APP = {
    canvas: null,
    ctx: null,
    data: [],
    img: null,
    init() {
      APP.canvas = document.querySelector('main canvas');
      APP.ctx = APP.canvas.getContext('2d');
      APP.canvas.width = 900;
      APP.canvas.style.width = 900;
      APP.canvas.height = 600;
      APP.canvas.style.height = 600;
      APP.img = document.createElement('img');
      APP.img.src = APP.canvas.getAttribute('data-src');
      APP.img.onload = (ev) => {
        APP.ctx.drawImage(APP.img, 0, 0);
        let imgDataObj = APP.ctx.getImageData(
          0,
          0,
          APP.canvas.width,
          APP.canvas.height
        );
        APP.data = imgDataObj.data; 
        APP.canvas.addEventListener('mousemove', APP.getPixel);
        APP.canvas.addEventListener('click', APP.addBox);
      };
    },
    getPixel(ev) {

      let cols = APP.canvas.width;
      let { offsetX, offsetY } = ev;
      let c = APP.getPixelColor(cols, offsetY, offsetX);
      let clr = `rgb(${c.red}, ${c.green}, ${c.blue})`; 
      document.getElementById('pixelColor').style.backgroundColor = clr;
      APP.pixel = clr;
      APP.getAverage(ev);
    },
    getAverage(ev) {

      let cols = APP.canvas.width;
      let rows = APP.canvas.height;
      APP.ctx.clearRect(0, 0, cols, rows);
      APP.ctx.drawImage(APP.img, 0, 0);
      let { offsetX, offsetY } = ev;
      const inset = 20;
      offsetX = Math.min(offsetX, cols - inset);
      offsetX = Math.max(inset, offsetX);
      offsetY = Math.min(offsetY, rows - inset);
      offsetY = Math.max(offsetY, inset);
      let reds = 0; 
      let greens = 0;
      let blues = 0;
      for (let x = -1 * inset; x <= inset; x++) {
        for (let y = -1 * inset; y <= inset; y++) {
          let c = APP.getPixelColor(cols, offsetY + y, offsetX + x);
          reds += c.red;
          greens += c.green;
          blues += c.blue;
        }
      }
      let nums = 41 * 41; 
      let red = Math.round(reds / nums);
      let green = Math.round(greens / nums);
      let blue = Math.round(blues / nums);
   
      let clr = `rgb(${red}, ${green}, ${blue})`;

      APP.ctx.fillStyle = clr;
      APP.ctx.strokeStyle = '#FFFFFF';
      APP.ctx.strokeWidth = 2;
      APP.average = clr;
      APP.ctx.strokeRect(offsetX - inset, offsetY - inset, 41, 41);
      APP.ctx.fillRect(offsetX - inset, offsetY - inset, 41, 41);
    },
    getPixelColor(cols, x, y) {
   
      let pixel = cols * x + y;
      let arrayPos = pixel * 4;
      return {
        red: APP.data[arrayPos],
        green: APP.data[arrayPos + 1],
        blue: APP.data[arrayPos + 2],
        alpha: APP.data[arrayPos + 3],
      };
    },
    addBox(ev) {
      let colours = document.querySelector('.colours');
      let pixel = document.createElement('span');
      pixel.className = 'box';
      pixel.setAttribute('data-label', 'Exact pixel');
      pixel.setAttribute('data-color', APP.pixel);
  
      let average = document.createElement('span');
      average.className = 'box';
      average.setAttribute('data-label', 'Average');
      average.setAttribute('data-color', APP.average);
  
      pixel.style.backgroundColor = APP.pixel;
      //average.style.backgroundColor = APP.average;
      //colours.append(pixel, average);
      colours.append(pixel);
    },
  };
  
  document.addEventListener('DOMContentLoaded', APP.init);