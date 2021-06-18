let canvas = document.getElementById("myCanvas");
let startButton = document.getElementById("startButton");
let closeButton = document.getElementById("closeButton"); 

const alive = 1;
const dead = 0;

const fieldWidth = 10;
const fieldHeight = 10;

const fieldCountWidth = canvas.width / fieldWidth;
const fieldCountHeigth = canvas.height / fieldHeight;

let CurrentFields = new Array(fieldCountHeigth).fill(dead).map(() => new Array(fieldCountWidth).fill(dead));

let context = canvas.getContext("2d");

function normaliseScreen(x,y) {
    return {
            x: Math.floor(x / fieldWidth) * fieldWidth,
            y: Math.floor(y / fieldHeight) * fieldHeight
            }
}

function screenToIndex(x,y) {
    return {
            x: Math.floor(x / fieldWidth),
            y: Math.floor(y / fieldHeight)
            }
}

function indexToScreen(x,y) {
    return {
            x: x * fieldWidth,
            y: y * fieldHeight
            }
}

function drawToCanvas(pos, state) {
    if (state == alive) {
        context.fillStyle = 'green';
    } else {
        context.fillStyle = 'white';
    }
    context.fillRect(pos.x, pos.y, fieldWidth, fieldHeight);
}

const posTupel = [
        [-1, -1],
        [-1,  0],
        [-1,  1],
        [ 0, -1],
        [ 0,  1],
        [ 1, -1],
        [ 1,  0],
        [ 1,  1],
    ];

function countAliveNeighbours(arr, x, y) {
    let count = 0;
    posTupel.forEach((offset) => {
        if (((offset[1] + y) > 0) && ((offset[1] + y) < arr.length) &&
            ((offset[0] + x) > 0) && ((offset[0] + x) < arr[y].length)) {
            
            let val = arr[y + offset[1]][x + offset[0]];
            if (val == alive) {
                count++;
            }
        } 
    });
    return count;
};

function showNext() {
    let NextFields = new Array(fieldCountHeigth).fill(dead).map(() => new Array(fieldCountWidth).fill(dead));;

    CurrentFields.forEach((value, indexY) => {
        CurrentFields[indexY].forEach((value, indexX) => {
            let count = countAliveNeighbours(CurrentFields, indexX, indexY);  
            
            if (value == alive) {
                if (count < 2) {    
                    NextFields[indexY][indexX] = dead;  
                } else if (count <= 3){
                    NextFields[indexY][indexX] = alive; 
                } else {
                    NextFields[indexY][indexX] = dead;  
                }
            } else {
                if (count == 3) {
                    NextFields[indexY][indexX] = alive; 
                }
            }
        })
    });   
  
    NextFields.forEach((value, indexY) => {
        NextFields[indexY].forEach((value, indexX) => {
            drawToCanvas(
                indexToScreen(indexX, indexY),
                value
            );
      })
  }) 
  CurrentFields = NextFields;
}

let startGame = function() { 
    setInterval(showNext, 100);
}

let endGame = function() {
    clearInterval(startGame);
}

canvas.addEventListener('click', function (event) {
    console.log('offsetX: ' + event.offsetX);
    console.log('offsetY: ' + event.offsetY);

    let pos = normaliseScreen(event.offsetX, event.offsetY);
    let index = screenToIndex(pos.x, pos.y);

    drawToCanvas(pos, alive);
    CurrentFields[index.y][index.x] = alive;

    console.log(CurrentFields);
});

startButton.addEventListener('click', startGame);
closeButton.addEventListener('click', endGame);
