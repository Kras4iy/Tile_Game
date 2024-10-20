import {TDrawRect} from "./types.ts";
import {config} from "./data.ts";
import {getNewFigure} from "./utils.ts";
const gameFieldInfo: {x:number, y:number, color: string}[][] = [];
let handInfo: {x: number, y: number, object?: any[]}[] = [];

const canvas: HTMLCanvasElement = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
// let clickEvent
let isClientClicked = false;
const clientCord = {x: 0, y:0};

const drawRect:TDrawRect = ({x,y,w,h, color})=> {
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

const initGameField = () => {
  let x = config.INIT_X;
  let y = config.INIT_Y;
  for( let i = 0; i < config.FIELD_AMOUNT; i++) {
    gameFieldInfo.push([]);
    for ( let j = 0; j < config.FIELD_AMOUNT; j++) {
      gameFieldInfo[i].push({x, y, color: "rgba(0,0,0,0.76)"});
      x = x + config.FIELD_GAP + config.TILE_WIDTH;
    }
    y = y + config.FIELD_GAP + config.TILE_WIDTH;
    x = config.INIT_X;
  }
}

const initHand =  () => {
  const lastFieldElem = gameFieldInfo[gameFieldInfo.length - 1][0];
  const y = lastFieldElem.y;
  let x = lastFieldElem.x;
  for(let i = 0; i < config.HAND_FIELD_ELEMS; i++) {
    handInfo.push({x,y})
    x = x + config.FIELD_GAP + config.PICK_FIELD_WIDTH;
  }
}

const fillHand = () => {
  const newHand = handInfo.map(elem => {
    const figure = getNewFigure();
    const xBlocks = figure[0].length;
    const yBlocks = figure.length;
    const width = xBlocks * config.HAND_TILE_WIDTH + (xBlocks - 1)*config.HAND_TILE_GAP;
    const height = yBlocks * config.HAND_TILE_WIDTH + (yBlocks -1)*config.HAND_TILE_GAP;
    const drawXPos = elem.x + config.PICK_FIELD_WIDTH / 2 - width/2;
    const drawYPos = elem.y + config.PICK_FIELD_WIDTH / 2 - height/2;

    let x = drawXPos;
    let y = drawYPos
    const color = '#000'

    const object:any[] = [];
    figure.forEach(row => {
      row.forEach(elem => {
        if (elem === 1) {
          object.push({x: x, y: y, color})
        }
        x = x + config.HAND_TILE_WIDTH + config.HAND_TILE_GAP;
      });
      x = drawXPos;
      y = y + config.HAND_TILE_WIDTH + config.HAND_TILE_GAP;
    })

    return {
      x: elem.x,
      y: elem.y,
      object,
    }
  });

  handInfo = newHand;
  console.log(handInfo);
}
const drawGameField = () => {
  gameFieldInfo.forEach(value => (
      value.forEach(({x,y, color}) => (
          drawRect({x,y,w: config.TILE_WIDTH, h: config.TILE_WIDTH, color})))
      ))}

const drawHand = () => {
  handInfo.forEach(elem => {
    drawRect({x: elem.x, y:elem.y, w: config.PICK_FIELD_WIDTH, h: config.PICK_FIELD_WIDTH, color:"#d28f73"});
    elem.object?.forEach(e => drawRect({x: e.x, y: e.y, w: config.HAND_TILE_WIDTH, h: config.HAND_TILE_WIDTH, color: e.color}))
  })
}

canvas.addEventListener("mousedown", () => {
  isClientClicked = true;
  console.log('mouseDownEvent');
})
canvas.addEventListener("mouseup", () => {
  isClientClicked = false;
  console.log('mouseUpEvent');
})
canvas.addEventListener("mousemove", (event) => {
  if (isClientClicked) {
    // console.log(event.clientX, event.clientY);
    clientCord.x = event.clientX;
    clientCord.y = event.clientY;
  }
})


console.log(gameFieldInfo)
console.log(handInfo);
const draw = () => {
  ctx.clearRect(0,0,canvas.width, canvas.height);
  drawGameField();
  drawHand();
  if (isClientClicked) {
    drawRect({x: clientCord.x, y: clientCord.y, w: 50, h: 50, color:"#000000"})
  }
}

function startGame() {
  initGameField();
  initHand();
  fillHand();
  setInterval(draw, 10);
}

startGame();
