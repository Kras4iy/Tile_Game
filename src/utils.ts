"use strict"
import {COLORS, config, FIGURES} from "./data.ts";
import { TGameField, THandInfo, TPlaceFigureOnField, TPutInBuffer, TUser, TWindow } from './types.ts';

const rotate90 = (matrix: number[][]) => matrix[0].map((_, index) => matrix.map(row => row[index]).reverse())

const rotateFigure = (mat: number[][])=> {
    let newMat = [...mat.map(el => [...el])];
    const rotateAmount = Math.floor(Math.random() * 4);
    for (let i = 0; i < rotateAmount; i++) {
        newMat = rotate90(newMat);
    }

    return newMat;
}

const mirrorFigure = (mat:number[][]) => {
    let newMat = [...mat.map(el => [...el])];
    const isMirror = Math.floor(Math.random() * 2);

    if (isMirror) {
        newMat = [...newMat.map(row => row.reverse())];
    }

    return newMat;
}
export const getNewFigure = () => {
    const figure = [...FIGURES[Math.floor(Math.random() * FIGURES.length)].map(row => [...row])];
    return rotateFigure(mirrorFigure(figure));

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
    const clientX = (event as any).clientX ? (event as MouseEvent).clientX : (event as TouchEvent).touches[0].clientX;
    const clientY = (event as any).clientY ? (event as MouseEvent).clientY : (event as TouchEvent).touches[0].clientY;
    user.isClicked = true;
    user.x = clientX;
    user.y = clientY;
    const selectedFigure = collisionDetect({x:clientX, y: clientY}, handInfo);
    if (!!selectedFigure) {
        user.selectedFigure = selectedFigure;
    }
    console.log('mouseDownEvent');
}

const getCorrectedSquare = (vertices:Record<string, { x: number, y: number }>,hoveredFields: Record<string, { x: number, y: number, color: string, i: number, j: number }>) => {
    let squareData: any = {
        xDiff: Number.MAX_SAFE_INTEGER,
        yDiff: Number.MAX_SAFE_INTEGER,
        square: {},
    };
    Object.values(hoveredFields).forEach(elem => {
        const xDiff = Math.abs(elem.x - vertices.A.x);
        const yDiff = Math.abs(elem.y - vertices.A.y);
        if (xDiff <= squareData.xDiff && yDiff <= squareData.yDiff) {
            squareData = {xDiff, yDiff, square: elem};
        }
    });

    return squareData.square;
}

const removeDublicates = (touchedFields:any[]) => {
    const newArray:any[] = [];

    touchedFields.forEach(element => {
        if(!newArray.find(elem => elem.i === element.i && elem.j === element.j)) {
            newArray.push(element);
        }
    })

    return newArray;
}

const isLastSquareMouseDown = (clientX: number, clientY: number, handInfo: THandInfo, selectedFigureId: number) => {
    if (clientX > handInfo[3].x
      && clientX < handInfo[3].x + config.PICK_FIELD_WIDTH
      && clientY > handInfo[3].y
      && clientY < handInfo[3].y + config.PICK_FIELD_WIDTH
      && selectedFigureId !== 3
    ) {
        return true;
    }
}

export const getFigureDropPosition = (event: MouseEvent | TouchEvent, user:TUser, gameField:TGameField, handInfo: THandInfo): TPlaceFigureOnField | TPutInBuffer => {
    const clientX = (event as any).clientX ? (event as MouseEvent).clientX : user.x;
    const clientY = (event as any).clientY ? (event as MouseEvent).clientY : user.y;
    const touchedFields:{ x: number, y: number, color: string, i: number, j: number }[] = [];
    if (user.selectedFigure) {
        if (isLastSquareMouseDown(clientX, clientY, handInfo, user.selectedFigure.id)) {
            return {
                event: 'putInBuffer',
                figure: user.selectedFigure.figure,
            }
        }
        let {x,y, initialX} = getDrawFigureCords(user.selectedFigure.figure, {x: clientX, y: clientY}, true, true);
        user.selectedFigure.figure.forEach(row => {
            row.forEach(e => {
                if (e === 1) {
                    const vertices:Record<string, { x: number, y: number }> = {
                        A: {x,y},
                        B: {x: x + config.TILE_WIDTH, y},
                        C: {x: x + config.TILE_WIDTH, y: y + config.TILE_WIDTH},
                        D: {x, y: y + config.TILE_WIDTH}
                    };
                    const hoveredFields:any = {};
                    Object.keys(vertices).forEach(key => {
                        for(let i = 0; i < gameField.length; i ++) {
                            for(let j = 0; j < gameField[i].length; j++) {
                                if (gameField[i][j].x < vertices[key].x
                                    && gameField[i][j].x + config.TILE_WIDTH > vertices[key].x
                                    && gameField[i][j].y < vertices[key].y
                                    && gameField[i][j].y + config.TILE_WIDTH > vertices[key].y
                                ) {
                                    hoveredFields[key] = {...gameField[i][j], i, j};
                                    break;
                                }
                            }
                        }
                    })

                    touchedFields.push(getCorrectedSquare(vertices, hoveredFields));
                }
                x = x + config.TILE_WIDTH + config.FIELD_GAP;
            })
            y = y + config.TILE_WIDTH + config.FIELD_GAP;
            x = initialX;
        })
    }

    return {
        event: 'placeFigureOnField',
        touchedFields: removeDublicates(touchedFields),
    }
}

const checkCollisions = (gameField:TGameField, dropSquares: TPlaceFigureOnField['touchedFields'], selectedFigure: TUser["selectedFigure"]) => {
    let isCollisionDetected = false;
    if (selectedFigure) {
        const selectedFigureFieldsCount = selectedFigure.figure.reduce((sum, curr) => sum + curr.filter(e => !!e).length,0)
        if (selectedFigure && selectedFigureFieldsCount !== dropSquares.length) {
            return true;
        }
        dropSquares.forEach(elem => {
            if (elem.i === undefined || elem.j === undefined || gameField[elem.i][elem.j].isFilled) {
                isCollisionDetected = true;
            }
        })
    }
    return isCollisionDetected;
}

export const paintField = (user:TUser, gameField:TGameField, dropSquares: ReturnType<typeof getFigureDropPosition>) => {
    if (dropSquares.event === 'placeFigureOnField' && !checkCollisions(gameField, dropSquares.touchedFields, user.selectedFigure)) {
        const {touchedFields} = dropSquares;
        increaseScore(touchedFields.length);
        touchedFields.forEach(elem => {
            gameField[elem.i][elem.j] = {...gameField[elem.i][elem.j], color: COLORS.tile, isFilled: true};
        })
        return true;
    }
    return false;
};

export const fillHandTile = (handFieldId: number,handInfo: THandInfo, _figure?: number[][]) => {
    if (handInfo[handFieldId]) {
        const handFieldItem = handInfo[handFieldId];
        const figure = _figure || getNewFigure();
        let {x, y, initialX} = getDrawFigureCords(figure, handFieldItem);
        const color = COLORS.tile

        const object: { figure: number[][], positions: any[] } = {figure, positions: []};
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

        handInfo[handFieldId] = {
            x: handFieldItem.x,
            y: handFieldItem.y,
            object,
        }
    }
}

export const fillHand = (handInfo: THandInfo) => {
    handInfo.forEach((_, id) => {id !== config.HAND_FIELD_ELEMS - 1 ? fillHandTile(id, handInfo) : handInfo});
    console.log(handInfo);
}

const getIsHandEmpty = (handInfo: THandInfo) => !handInfo.slice(0, config.HAND_FIELD_ELEMS - 1).find(elem => !!elem.object);

const detectAndClearFilledRows = (gameField: TGameField) => {
    const gameFieldSimpleCopy : number[][] = [];
    let completedRowsCounter = 0;

    gameField.forEach(row => {
        if (row.find(tile => !tile.isFilled)) {
            gameFieldSimpleCopy.push(new Array(config.FIELD_AMOUNT).fill(0));
        } else {
            gameFieldSimpleCopy.push(new Array(config.FIELD_AMOUNT).fill(1));
            completedRowsCounter++;
        }
    })

    for(let i = 0; i < gameField.length; i++) {
        let isHasEmptyTile = false;
        for(let j = 0; j < gameField[i].length; j++) {
            if (!gameField[j][i].isFilled) {
                isHasEmptyTile = true
                break;
            }
        }
        if (!isHasEmptyTile) {
            completedRowsCounter++;
            gameFieldSimpleCopy.forEach(row => {
                row[i] = 1;
            })
        }
    }

    for(let i = 0; i < gameFieldSimpleCopy.length; i++) {
        for(let j = 0;j < gameFieldSimpleCopy[i].length; j++) {
            if (!!gameFieldSimpleCopy[i][j]) {
                gameField[i][j].isFilled = false;
                gameField[i][j].color = COLORS.field;
            }
        }
    }

    increaseScore(completedRowsCounter * config.SCORE_PER_ROW)
}

const increaseScore = (value: number) => {
    (window as any as TWindow).__GameData__.score += value;
}
export const doActions = (event: MouseEvent | TouchEvent, user:TUser, gameField:TGameField, handInfo: THandInfo) => {
    const dropSquares = getFigureDropPosition(event, user, gameField, handInfo);
    console.log(dropSquares);

    if (dropSquares.event === 'putInBuffer' && user.selectedFigure) {
        fillHandTile(3, handInfo, user.selectedFigure.figure)
        console.log(handInfo);
    }
    const isPainted = paintField(user, gameField, dropSquares);

    if ((isPainted || dropSquares.event === 'putInBuffer') && user.selectedFigure) {
        handInfo[user.selectedFigure.id].object = undefined;
    }
    detectAndClearFilledRows(gameField);
    if (getIsHandEmpty(handInfo)) {
        fillHand(handInfo);
    }

}
