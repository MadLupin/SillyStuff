
function normalize(aValue, aNormalizer) {
    return Math.floor(aValue / aNormalizer) * aNormalizer;
}

class Index {
    constructor(args) {
        if (args.width) {
            this.x = args.x / args.width;
            this.y = args.y / args.width;
        } else {
            this.x = args.x;
            this.y = args.y;
        } 
    }
}

class Rect {

    constructor(args) {
        if (args.x && args.y && args.width) {
            if (args.norm) {
                this.x = normalize(args.x, args.norm);
                this.y = normalize(args.y, args.norm);
            } else {
                this.x = args.x;
                this.y = args.y;
            }
            this.width = args.width;
        } else {
            if (args.index && args.width) {
                this.x = args.index.x * args.width;
                this.y = args.index.y * args.width;
                this.width = args.width;
            }
        }
    }

    getIndex() {
        return new Index({
            x: this.x / this.width, 
            y : this.y / this.width})
    }
}

class Grid {

    LineColor = 'darkgrey';
    defaultFieldColor = 'lightgrey';

    constructor(aCanvas, aFieldWidth, onDrawValue) {
        this.canvas = aCanvas;
        this.fieldWidth = aFieldWidth;
        this.context = canvas.getContext("2d");
        this.fields = this.getFieldsArray();
        this.onDrawValue = onDrawValue;
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getFieldsArray(aDefaultState = 0) {
        let FieldCount = this.getFieldCount();

        let arr = new Array(FieldCount).fill(aDefaultState);

        for (let i = 0; i < arr.length; i++) {
            arr[i] = new Array(FieldCount).fill(aDefaultState);            
        }

        return arr;
    }

    getRectByIndex(aIndex) {
        return new Rect({index : aIndex, width : this.fieldWidth});
    }

    getRectByPos(x, y) {
        return new Rect({x: x, y :y, width: this.fieldWidth, norm : this.fieldWidth});
    }

    getIndexByRect(rect) {
        return new Index({rect});
    }

    getIndexByPos(x, y) {
        return new Rect({x: x,y: y, width: this.fieldWidth, norm: this.fieldWidth}).getIndex();
    }
  
    getFieldCount() {
        return this.canvas.width / this.fieldWidth;
    }
    
    drawGridLines(){
        let w = this.canvas.width;
    
        this.context.beginPath();
        for (let x = 0; x <= w; x += this.fieldWidth) {
            this.context.moveTo(x, 0);
            this.context.lineTo(x, w);
        }

        this.context.strokeStyle = this.LineColor;
        this.context.lineWidth = 1;    
        this.context.stroke();
    
    
        this.context.beginPath();
        for (let y = 0; y <= w; y += this.fieldWidth) {
            this.context.moveTo(0, y);
            this.context.lineTo(w, y);
        }

        this.context.strokeStyle = this.LineColor;
        this.context.lineWidth = 1;
        this.context.stroke();    
    }

    forEachField(onItem){        
        for (let i = 0; i < this.fields.length; i++) {
            for (let j = 0; i < this.fields[i].length; j++){
                return onItem(i, j, this.fields[i][j]);
            }
        }       
    }

    normalize(aValue, aNormalizer) {
        return Math.floor(aValue / aNormalizer) * aNormalizer;
    }

    resizeGrid(){
        // let newWidth, newHeight;
        // const canvasMargine = 0.3;
        // const roundTo100 = 100;
    
        // newWidth = normalize(window.innerWidth, roundTo100) - normalize(window.innerWidth * canvasMargine, roundTo100);
        // newHeight = newWidth;
    
        // if ((canvas.width != newWidth) && (canvas.height != newHeight) && (canvas.height <= window.innerHeight * 0.4)) {
        //         canvas.width = newWidth;
        //         canvas.height = newHeight;

        //         this.fields = getFieldsArray();
        //         this.forEachField((indexX, indexY, value) => {
        //             this.drawRect(this.getRectByIndex(new Index({x: indexX, y :indexY}), value));
        //         });       
        //         drawGridLines();
        // }
    }

    redraw() {
        this.forEachField((x, y, value) => {
            this.drawRect(this.getRectByIndex(new Index({x, y}), value));
        });
        this.drawGridLines();
    };

    drawRect(aRect, value) {
        let color = this.onDrawValue(value);

        if (color === undefined) {
            color = this.defaultFieldColor;
        }

        this.context.fillStyle = color;

        this.context.fillRect(aRect.x, aRect.y, aRect.width, aRect.width);        
    }
}
