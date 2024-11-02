const FIELD_AMOUNT = 8;
const FIELD_GAP = 5;
const TILE_WIDTH = 50;
const HAND_TILE_WIDTH = TILE_WIDTH/2;
const HAND_TILE_GAP = 2;
const HAND_FIELD_ELEMS = 4;
const PICK_FIELD_WIDTH = TILE_WIDTH * 2 + FIELD_GAP;

const layout_settings = {
    horizontal_paddings: 0.05,
}
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

export const COLORS = {
    //https://colorhunt.co/palette/c6e7ffd4f6fffbfbfbffddae
    tile: "#CBD2A4",
    field: "#9A7E6F",
    shadow: "#E9EED9",
    hand: "#54473F"
}

export const getInitConfig = (canvas: HTMLCanvasElement) => {
    const width = canvas.width;
    const height = canvas.height - PICK_FIELD_WIDTH - FIELD_GAP;
    let fieldWidth = 0;

    if (width < height) {
        fieldWidth  = width*(1 - 2*layout_settings.horizontal_paddings);
    } else {
        fieldWidth = height*(1 - 2*layout_settings.horizontal_paddings);
    }

    const fieldAmountWithHand = FIELD_AMOUNT + 2;

    config.TILE_WIDTH = (fieldWidth - (fieldAmountWithHand - 1) * FIELD_GAP)/fieldAmountWithHand;
    config.PICK_FIELD_WIDTH = config.TILE_WIDTH * 2 + config.FIELD_GAP;
    config.INIT_X = (width - (config.TILE_WIDTH * config.FIELD_AMOUNT + config.FIELD_GAP*(config.FIELD_AMOUNT - 1)))/2;

    console.log(config);
}


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

const length5 = [
    [1],
    [1],
    [1],
    [1],
    [1],
]

const length2 = [
    [1],
    [1],
]

const length3 = [
    [1],
    [1],
    [1],
]

const chessBoard = [
    [1,0],
    [0,1],
]

const bridge = [
    [1,1,1],
    [1,0,1]
]

const oneSquare = [
    [1],
]

export const FIGURES = [
    bigSquare,
    smallSquare,
    knight,
    corner,
    length5,
    length3,
    length2,
    chessBoard,
    bridge,
    // oneSquare
]
