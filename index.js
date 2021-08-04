let canvas = document.getElementById("myCanvas");
let canvasContainer = document.getElementById("myContainer");
let canvasBackgroundColor = window.getComputedStyle( canvas.parentElement ,null).getPropertyValue('background-color'); 

let startButton = document.getElementById("startButton");
let closeButton = document.getElementById("closeButton"); 
let resetButton = document.getElementById("resetButton");

const fieldWidth = 25;

let interval;
const intervalTime = 200;

const grid = new Grid(canvas, fieldWidth, (value) => {
    switch (value) {
        case 0:
            return 'grey';
        case 1: 
            return 'green';    
        default:
            return 'red';
    }
});

const game = new GameOfLife(grid);

let startGame = function(){
    interval = setInterval(game.showNext, intervalTime);
}

let endGame = function() {
    clearInterval(interval);
}

let resetGame = function() {   
    endGame();
    grid.clear(); 
}

canvas.addEventListener('click', function (event) {
    let index = grid.getIndexByPos(event.offsetX, event.offsetY);
    let rect = grid.getRectByIndex(index);

    switch (grid.fields[index.y][index.x]) {
        case alive:            
            grid.fields[index.y][index.x] = dead;
            grid.drawRect(rect, dead);
            break;
        case dead:
            grid.fields[index.y][index.x] = alive;
            grid.drawRect(rect, alive);
            break;    
        default:
            console.log("Unexpected fields value");
            break;
    }
});

startButton.addEventListener('click', startGame);
closeButton.addEventListener('click', endGame);
resetButton.addEventListener('click', resetGame);
window.addEventListener('resize', resizeCanvas);

grid.redraw();