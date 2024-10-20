const FIELD_AMOUNT = 8;
const FIELD_GAP = 5;
const TILE_WIDTH = 50;
const HAND_TILE_WIDTH = TILE_WIDTH/2;
const HAND_TILE_GAP = 2;
const HAND_FIELD_ELEMS = 4;
const PICK_FIELD_WIDTH = Math.floor(((FIELD_AMOUNT * TILE_WIDTH + (FIELD_AMOUNT - 1) * FIELD_GAP) - (HAND_FIELD_ELEMS - 1)*FIELD_GAP) / HAND_FIELD_ELEMS);
export const config = {
    FIELD_AMOUNT,
    TILE_WIDTH,
    FIELD_GAP,
    INIT_X: 100,
    INIT_Y: 100,
    HAND_TILE_WIDTH,
    HAND_TILE_GAP,
    PICK_FIELD_WIDTH,
    HAND_FIELD_ELEMS
};

const bigSquare = [
    [1,1,1],
    [1,1,1],
    [1,1,1],
];

const smallSquare = [
    [1,1],
    [1,1],
]

const knight = [
    [1,1],
    [1,0],
    [1,0],
]

const corner = [
    [1,1],
    [1,0]
]

export const FIGURES = [
    bigSquare,
    smallSquare,
    knight,
    corner
]
