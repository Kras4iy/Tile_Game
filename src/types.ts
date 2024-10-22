export type TDrawRect = (data: {x: number,y: number,w: number,h: number, color: string}) => void
export type THandInfo = {x: number, y: number, object?: {figure: number[][], positions:any[]}}[];
export type TUser = {x: number, y:number, isClicked: boolean, selectedFigure?: {id: number, figure: number[][]}};
