export type TDrawRect = (data: {x: number,y: number,w: number,h: number, color: string}) => void
export type THandInfo = {x: number, y: number, object?: {figure: number[][], positions:any[]}}[];
export type TUser = {x: number, y:number, isClicked: boolean, selectedFigure?: {id: number, figure: number[][]}};
export type TGameField =  {x:number, y:number, color: string, isFilled: boolean}[][];

export type TGameData = {
  score: number,
}

export type TWindow = {
  __GameData__: TGameData;
}

export type TPlaceFigureOnField = {
  event: 'placeFigureOnField',
  touchedFields: any[],
}

export type TPutInBuffer = {
  event: 'putInBuffer',
  figure: number[][],
}
