import {FIGURES} from "./data.ts";

function rotate90(mat: number[][]) {
    const n = mat.length;

    // Initialize the result matrix with zeros
    const res = Array.from({ length: n }, () => Array(n).fill(0));

    // Flip the matrix counterclockwise using nested loops
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
