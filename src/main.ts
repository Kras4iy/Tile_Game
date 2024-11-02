"use strict"
import ReactApp from "./React";
import { TGameData, TDrawRect, TGameField, THandInfo, TUser, TWindow } from './types.ts';
import {COLORS, config, getInitConfig} from "./data.ts";
import {doActions, drawShadow, fillHand, getDrawFigureCords, touchEvent} from "./utils.ts";

import './styles.css';
const gameFieldInfo:TGameField = [];
let handInfo:THandInfo = [];

const GameData: TGameData = {
  score: 0,
};

(window as any).__GameData__ = GameData;

const canvas: HTMLCanvasElement = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = document.body.clientWidth; //document.width is obsolete
canvas.height = document.body.clientHeight;
getInitConfig(canvas, ctx);
// let clickEvent
const user: TUser = {x: 0, y:0, isClicked: false};


const drawScore = () => {
  ctx.fillStyle = COLORS.field;
  ctx.fillText(`Score: ${(window as any as TWindow).__GameData__.score}`, config.SCORE_X, config.SCORE_Y);
  config.DEBUG_MODE && drawRect({x: config.SCORE_X, y: config.SCORE_Y, w: 2, h: 2, color: "red"})
}
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
      gameFieldInfo[i].push({x, y , color: COLORS.field, isFilled: false, isShadow: false});
      x = x + config.FIELD_GAP + config.TILE_WIDTH;
    }
    y = y + config.FIELD_GAP + config.TILE_WIDTH;
    x = config.INIT_X;
  }
}

const initHand =  () => {
  const lastFieldElem = gameFieldInfo[gameFieldInfo.length - 1][0];
  const y = lastFieldElem.y + config.TILE_WIDTH + config.FIELD_GAP;
  let x = lastFieldElem.x;
  for(let i = 0; i < config.HAND_FIELD_ELEMS; i++) {
    handInfo.push({x,y})
    x = x + config.FIELD_GAP + config.PICK_FIELD_WIDTH;
  }
}

const drawGameField = () => {
  gameFieldInfo.forEach(value => (
      value.forEach(({x,y, color}) => (
          drawRect({x,y,w: config.TILE_WIDTH, h: config.TILE_WIDTH, color})))
      ))}

const drawHand = () => {
  handInfo.forEach((elem, id) => {
    drawRect({x: elem.x, y:elem.y, w: config.PICK_FIELD_WIDTH, h: config.PICK_FIELD_WIDTH, color: COLORS.hand});
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
          drawRect({x: x-1, y: y-1, w: config.TILE_WIDTH + 2, h: config.TILE_WIDTH + 2, color: COLORS.black})
          drawRect({x,y,w: config.TILE_WIDTH, h: config.TILE_WIDTH, color: COLORS.tile});
        }
        x = x + config.TILE_WIDTH + config.FIELD_GAP;
      });
      y = y + config.TILE_WIDTH + config.FIELD_GAP;
      x = initialX;
    })
  }
}

canvas.addEventListener("touchstart", (event) => {
  console.log('touchstart', event);
  touchEvent(event, user, handInfo);
});
canvas.addEventListener("mousedown", (event) => {
  console.log('mousedown', event);
  touchEvent(event, user, handInfo);
})
canvas.addEventListener("mouseup", (event) => {
  doActions(event, user, gameFieldInfo, handInfo);
  user.isClicked = false;
  user.selectedFigure = undefined;
  console.log('mouseUpEvent');
})

canvas.addEventListener("touchend", (event) => {
  doActions(event, user, gameFieldInfo, handInfo);
  user.isClicked = false;
  user.selectedFigure = undefined;
});

canvas.addEventListener("mousemove", (event) => {
    user.x = event.clientX;
    user.y = event.clientY;
})

canvas.addEventListener("touchmove", (event) => {
  event.preventDefault();
  event.stopPropagation();
  // window.scrollTo(0, 0);


  user.x = event.touches[0].clientX;
  user.y = event.touches[0].clientY;
});


console.log(gameFieldInfo)
console.log(handInfo);
const draw = () => {
  ctx.clearRect(0,0,canvas.width, canvas.height);
  drawGameField();
  drawHand();
  drawScore();
  if (user.isClicked) {
    drawSelectedFigure();
    drawShadow(user, gameFieldInfo, handInfo);
  }
}

function startGame() {
  initGameField();
  initHand();
  fillHand(handInfo);
  // draw();
  setInterval(draw, 10);
}
if (config.DEBUG_MODE) {
  ReactApp();
}

startGame();
