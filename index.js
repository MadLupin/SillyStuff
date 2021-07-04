let canvas = document.getElementById("myCanvas");
let canvasContainer = document.getElementById("myContainer");
let canvasBackgroundColor = window.getComputedStyle( canvas.parentElement ,null).getPropertyValue('background-color'); 

let startButton = document.getElementById("startButton");
let closeButton = document.getElementById("closeButton"); 
let resetButton = document.getElementById("resetButton");

const alive = 1;
const dead = 0;

const fieldWidth = 25;
const fieldHeigth = 25;

let interval;
const intervalTime = 200;

let CurrentFields = getNewArray();
let totalAliveCount = 0;

let context = canvas.getContext("2d");

function getIndexByScreen(x,y) {
    return {
            x: Math.floor(x / fieldWidth),
            y: Math.floor(y / fieldHeigth)
            }
}

function getHeightFieldCount() {
    return canvas.height / fieldHeigth;
}

function getWidthFieldCount() {
    return canvas.width / fieldWidth;
}

function getNormalisedScreenPos(x,y) {
    return {
            x: Math.floor(x / fieldWidth) * fieldWidth,
            y: Math.floor(y / fieldHeigth) * fieldHeigth
            }
}

function getNewArray() {
    return new Array(getHeightFieldCount()).fill(dead).map(() => new Array(getWidthFieldCount()).fill(dead));
}

function getPosByIndex(x,y) {
    return {
            x: x * fieldWidth,
            y: y * fieldHeigth
            }
}

function drawToCanvas(pos, state) {
    if (state == alive) {
        context.fillStyle = 'green';
    } else {
        context.fillStyle = 'lightgrey';
    }
    context.fillRect(pos.x, pos.y, fieldWidth, fieldHeigth);
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

    let NextFields = getNewArray();
    totalAliveCount = 0;

    iterate2dArray(CurrentFields, (indexX, indexY, value) => {
        let count = countAliveNeighbours(CurrentFields, indexX, indexY);  
            
        if (value == alive) {
            if (count < 2) {    
                NextFields[indexY][indexX] = dead;  
            } else if (count <= 3){
                NextFields[indexY][indexX] = alive; 
                totalAliveCount++;
            } else {
                NextFields[indexY][indexX] = dead;  
            }
        } else {
            if (count == 3) {
                NextFields[indexY][indexX] = alive; 
                totalAliveCount++;
            }
        }        
    })
    
    iterate2dArray(NextFields, (indexX, indexY, value) => {
        drawToCanvas(getPosByIndex(indexX, indexY),value);
    })

    CurrentFields = NextFields;
    drawGrid();

    if (totalAliveCount == 0) {
        endGame();
    }
}

function iterate2dArray(arr, onItem){
    arr.forEach((_arr, indexY) => {
        arr[indexY].forEach((value, indexX) => {
            onItem(indexX, indexY, value)
        })
    });
}

function drawGrid() {
    let w = canvas.width;
    let h = canvas.height;

    context.beginPath();
    for (let x = 0; x <= w; x += fieldWidth) {
        context.moveTo(x, 0);
        context.lineTo(x, h);
    }
    context.strokeStyle = 'grey';
    context.lineWidth = 1;    
    context.stroke();


    context.beginPath();
    for (let y = 0; y <= h; y += fieldHeigth) {
        context.moveTo(0, y);
        context.lineTo(w, y);
    }
    context.strokeStyle = 'grey';
    context.lineWidth = 1;
    context.stroke();

}

function clearCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function normalize(aValue, aNormalizer) {
    return Math.floor(aValue / aNormalizer) * aNormalizer;
}

function resizeCanvas(){
    let newWidth, newHeight;
    const canvasMargine = 0.3;
    const roundTo100 = 100;

    newWidth = normalize(window.innerWidth, roundTo100) - normalize(window.innerWidth * canvasMargine, roundTo100);
    newHeight = newWidth;

    if ((canvas.width != newWidth) && (canvas.height != newHeight) && (canvas.height <= window.innerHeight * 0.4)) {
            canvas.width = newWidth;
            canvas.height = newHeight;

            CurrentFields = getNewArray();
            iterate2dArray(CurrentFields, (indexX, indexY, value) => {
                drawToCanvas(getPosByIndex(indexX, indexY),value)
            });       
            drawGrid();
    }
}

let startGame = function(){
    interval = setInterval(showNext, intervalTime);
}

let endGame = function() {
    clearInterval(interval);
}

let resetGame = function() {
    endGame();
        
    CurrentFields = getNewArray();
   
    iterate2dArray(CurrentFields, (indexX, indexY, value) => {
        drawToCanvas(getPosByIndex(indexX, indexY),value);
    });
    drawGrid();    
}

canvas.addEventListener('click', function (event) {

    let pos = getNormalisedScreenPos(event.offsetX, event.offsetY);
    let index = getIndexByScreen(pos.x, pos.y);

    switch (CurrentFields[index.y][index.x]) {
        case alive:
            CurrentFields[index.y][index.x] = dead;
            break;
        case dead:
            CurrentFields[index.y][index.x] = alive;
            break;    
        default:
            break;
    }
    clearCanvas();
    
    iterate2dArray(CurrentFields, (x, y, value) => {
        let indexPos = getPosByIndex(x, y);    
        drawToCanvas(indexPos, value);
    });

    drawGrid();
});

startButton.addEventListener('click', startGame);
closeButton.addEventListener('click', endGame);
resetButton.addEventListener('click', resetGame);
window.addEventListener('resize', resizeCanvas);

drawGrid();
