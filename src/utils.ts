import {config, FIGURES} from "./data.ts";
import {THandInfo, TUser} from "./types.ts";

function rotate90(mat: number[][]) {
    const n = mat.length;

    const res = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            res[n - j - 1][i] = mat[i][j];
        }
    }
    return res.map(row => row.filter(e => typeof e !== "undefined")).filter(row => row.length > 0);;
}

const rotateFigure = (mat: number[][])=> {
    let newMat = [...mat];
    const rotateAmount = Math.floor(Math.random() * 4);
    for (let i = 0; i < rotateAmount; i++) {
        newMat = rotate90(newMat);
    }

    return newMat;
}

const mirrorFigure = (mat:number[][]) => {
    let newMat = [...mat];
    const isMirror = Math.floor(Math.random() * 2);

    if (isMirror) {
        newMat = newMat.map(row => row.reverse());
    }

    return newMat;
}
export const getNewFigure = () => {
    const figure = FIGURES[Math.floor(Math.random() * FIGURES.length)]
    return rotateFigure(mirrorFigure(figure));;

}

export const collisionDetect = (clickCords: {x: number, y: number}, handInfo:THandInfo) => {
    let figure: number[][] | undefined = undefined;
    let id: number | undefined  = undefined;
    for (let i = 0; i < handInfo.length; i++) {
        if (clickCords.x > handInfo[i].x
            && clickCords.x < handInfo[i].x + config.PICK_FIELD_WIDTH
            && clickCords.y > handInfo[i].y
            && clickCords.y < handInfo[i].y + config.PICK_FIELD_WIDTH
            && handInfo[i].object?.figure) {
            figure = handInfo[i].object?.figure;
            id = i;
            break;
        }
    }
    if (figure && id !== undefined) {
        return {figure, id};
    }
    return undefined;
}

export const getDrawFigureCords = (figure: number[][], elem: {x: number,y: number}, isElemIsCenter = false, fullSize = false) => {
    const xBlocks = figure[0].length;
    const yBlocks = figure.length;
    const width = xBlocks * (fullSize ? config.TILE_WIDTH: config.HAND_TILE_WIDTH) + (xBlocks - 1)*(fullSize ? config.FIELD_GAP : config.HAND_TILE_GAP);
    const height = yBlocks * (fullSize ? config.TILE_WIDTH: config.HAND_TILE_WIDTH) + (yBlocks -1)*(fullSize ? config.FIELD_GAP : config.HAND_TILE_GAP);
    const drawXPos = isElemIsCenter ? elem.x - width/2 : elem.x + config.PICK_FIELD_WIDTH / 2 - width/2;
    const drawYPos = isElemIsCenter ? elem.y - height/2 : elem.y + config.PICK_FIELD_WIDTH / 2 - height/2;

    return {y: drawYPos, x:drawXPos, initialX: drawXPos, initialY: drawYPos};
}

export const touchEvent = (event:TouchEvent | MouseEvent, user:TUser, handInfo: THandInfo) => {
    const clientX = Object.prototype.hasOwnProperty.call(event, "clientX") ? (event as MouseEvent).clientX : (event as TouchEvent).touches[0].clientX;
    const clientY = Object.prototype.hasOwnProperty.call(event, "clientY") ? (event as MouseEvent).clientX : (event as TouchEvent).touches[0].clientY;
    user.isClicked = true;
    user.x = clientX;
    user.y = clientY;
    const selectedFigure = collisionDetect({x:clientX, y: clientY}, handInfo);
    console.log(selectedFigure);
    if (!!selectedFigure) {
        user.selectedFigure = selectedFigure;
    }
    console.log('mouseDownEvent');
}
