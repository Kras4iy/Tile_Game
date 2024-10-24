import {TDrawRect, THandInfo, TUser} from "./types.ts";
import {config} from "./data.ts";
import {getDrawFigureCords, getNewFigure, touchEvent} from "./utils.ts";
const gameFieldInfo: {x:number, y:number, color: string}[][] = [];
let handInfo:THandInfo = [];

const canvas: HTMLCanvasElement = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
// let clickEvent
const user: TUser = {x: 0, y:0, isClicked: false};

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
    let {x,y, initialX} = getDrawFigureCords(figure, elem);
    const color = '#000'

    const object: {figure: number[][], positions:any[]} = {figure, positions: []};
    figure.forEach(row => {
      row.forEach(elem => {
        if (elem === 1) {
          object.positions.push({x: x, y: y, color})
        }
        x = x + config.HAND_TILE_WIDTH + config.HAND_TILE_GAP;
      });
      x = initialX;
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
  handInfo.forEach((elem, id) => {
    drawRect({x: elem.x, y:elem.y, w: config.PICK_FIELD_WIDTH, h: config.PICK_FIELD_WIDTH, color:"#d28f73"});
    if (user.selectedFigure?.id !== id) {
      elem.object?.positions.forEach(e => drawRect({x: e.x, y: e.y, w: config.HAND_TILE_WIDTH, h: config.HAND_TILE_WIDTH, color: e.color}))
    }
  })
}

const drawSelectedFigure = () => {
  if(user.isClicked && user.selectedFigure?.figure) {
    let {x,y, initialX} = getDrawFigureCords(user.selectedFigure?.figure, user, true, true);
    user.selectedFigure.figure.forEach(row => {
      row.forEach(cell => {
        if (cell) {
          drawRect({x,y,w: config.TILE_WIDTH, h: config.TILE_WIDTH, color: "#000"});
        }
        x = x + config.TILE_WIDTH + config.FIELD_GAP;
      });
      y = y + config.TILE_WIDTH + config.FIELD_GAP;
      x = initialX;
    })
  }
}

canvas.addEventListener("touchstart", (event) => {
  touchEvent(event, user, handInfo);
});
canvas.addEventListener("mousedown", (event) => {
  touchEvent(event, user, handInfo);
})
canvas.addEventListener("mouseup", () => {
  user.isClicked = false;
  user.selectedFigure = undefined;
  console.log('mouseUpEvent');
})

canvas.addEventListener("touchend", () => {
  user.isClicked = false;
  user.selectedFigure = undefined;
});

canvas.addEventListener("mousemove", (event) => {
    user.x = event.clientX;
    user.y = event.clientY;
})

canvas.addEventListener("touchmove", (event) => {
  user.x = event.touches[0].clientX;
  user.y = event.touches[0].clientY;
});


console.log(gameFieldInfo)
console.log(handInfo);
const draw = () => {
  ctx.clearRect(0,0,canvas.width, canvas.height);
  drawGameField();
  drawHand();
  if (user.isClicked) {
    drawSelectedFigure();
  }
}

function startGame() {
  initGameField();
  initHand();
  fillHand();
  setInterval(draw, 10);
}

startGame();
