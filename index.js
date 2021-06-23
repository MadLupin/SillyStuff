let canvas = document.getElementById("myCanvas");
let startButton = document.getElementById("startButton");
let closeButton = document.getElementById("closeButton"); 

const alive = 1;
const dead = 0;

const fieldWidth = 25;
const fieldHeigth = 25;

const fieldCountWidth = canvas.width / fieldWidth;
const fieldCountHeigth = canvas.height / fieldHeigth;

const intervalTime = 200;

let CurrentFields = new Array(fieldCountHeigth).fill(dead).map(() => new Array(fieldCountWidth).fill(dead));

let context = canvas.getContext("2d");

function normaliseScreen(x,y) {
    return {
            x: Math.floor(x / fieldWidth) * fieldWidth,
            y: Math.floor(y / fieldHeigth) * fieldHeigth
            }
}

function screenToIndex(x,y) {
    return {
            x: Math.floor(x / fieldWidth),
            y: Math.floor(y / fieldHeigth)
            }
}

function indexToScreen(x,y) {
    return {
            x: x * fieldWidth,
            y: y * fieldHeigth
            }
}

function drawToCanvas(pos, state) {
    if (state == alive) {
        context.fillStyle = 'green';
    } else {
        context.fillStyle = 'white';
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

    let NextFields = new Array(fieldCountHeigth).fill(dead).map(() => new Array(fieldCountWidth).fill(dead));;

    transformArray(CurrentFields, (indexX, indexY, value) => {
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
    
    transformArray(NextFields, (indexX, indexY, value) => {
        drawToCanvas(indexToScreen(indexX, indexY),value);
    })

    CurrentFields = NextFields;
    drawGrid();
}

function transformArray(arr, onItem){
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

let interval;
let startGame = function(){
    interval = setInterval(showNext, intervalTime);
}

let endGame = function() {
    clearInterval(interval);
}

canvas.addEventListener('click', function (event) {

    let pos = normaliseScreen(event.offsetX, event.offsetY);
    let index = screenToIndex(pos.x, pos.y);

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
    
    transformArray(CurrentFields, (x, y, value) => {
        let indexPos = indexToScreen(x, y);    
        drawToCanvas(indexPos, value);
    });

    drawGrid();

    console.log(CurrentFields);
});

startButton.addEventListener('click', startGame);
closeButton.addEventListener('click', endGame);
drawGrid();
