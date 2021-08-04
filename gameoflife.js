class GameOfLife {

    dead = 0;
    alive = 1;

    ended = false;
    
    posTupel = [
        [-1, -1],
        [-1,  0],
        [-1,  1],
        [ 0, -1],
        [ 0,  1],
        [ 1, -1],
        [ 1,  0],
        [ 1,  1],
    ];

    constructor (grid) {
        this.grid = grid;
        this.grid.onState = getStateColor;
        this.totalAliveCount = 0;
    }

    getStateColor(state) {
        if (state == this.alive) {
            return 'green';
        } else {
            return 'lightgrey';
        }
    }

    showNext() {

        if (this.ended) return false;

        let NextFields = this.grid.getNewArray();
        let CurrentFields = this.grid.fields;
        this.totalAliveCount = 0;
        let redrawList = [];

        this.grid.forEachField((indexX, indexY, value) => {
            let count = countAliveNeighbours(CurrentFields, indexX, indexY);  

            if (value == this.alive) {
                if (count < 2) {    
                    NextFields[indexY][indexX] = this.dead;  
                } else if (count <= 3){
                    NextFields[indexY][indexX] = this.alive; 
                    this.totalAliveCount++;
                } else {
                    NextFields[indexY][indexX] = this.dead;  
                }
            } else {
                if (count == 3) {
                    NextFields[indexY][indexX] = this.alive; 
                    this.totalAliveCount++;
                }
            }               

            if (value != NextFields[indexY][indexX]) {
                redrawList.push({y : indexY, x : indexX, newValue : NextFields[indexY][indexX]});
            }
        });

        this.grid.fields = NextFields;
    
        redrawList.forEach((index) => {
            this.grid.drawRect(grid.getRectByIndex(index), index.newValue);
        });

        if (totalAliveCount == 0) {
            this.ended = true;
        }        
        return true;
    }    

    countAliveNeighbours(arr, x, y) {
        let count = 0;
        this.posTupel.forEach((offset) => {
            if (((offset[1] + y) > 0) && ((offset[1] + y) < arr.length) &&
                ((offset[0] + x) > 0) && ((offset[0] + x) < arr[y].length)) {
                
                let val = arr[y + offset[1]][x + offset[0]];
    
                if (val == this.alive) {
                    count++;
                }
            } 
        });
        return count;
    }
    
}