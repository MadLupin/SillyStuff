
function normalize(aValue, aNormalizer) {
    return Math.floor(aValue / aNormalizer) * aNormalizer;
}

class Index {
    constructor(rect) {
        this.x = rect.x / rect.width;
        this.y = rect.y / rect.width;
    }
    
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

class Rect {

    constructor(index, width) {
        this.x = index.x * width;
        this.y = indey.y * width;
        this.width = width;
    }

    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width;
    }

    constructor(x, y, width, norm) {
        if (norm) {
            this.x = normalize(x, norm);
            this.y = normalize(y, norm);
        } else {
            this.x = x;
            this.y = y;
        }

        this.width = width;
    }

    get Index() {
        return new Index(
            this.x / this.width, 
            this.y / this.width)
    }
}

class Grid {

    LineColor = 'darkgrey';
    defaultFieldColor = 'lightgrey';

    constructor(aCanvas, aFieldWidth, onState) {
        this.canvas = aCanvas;
        this.fieldWidth = aFieldWidth;
        this.context = canvas.getContext("2d");
        this.fields = getFieldsArray();
        this.onState = onState;
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getFieldsArray(aDefaultState = 0) {
        let FieldCount = getFieldCount();
        return new Array(FieldCount).fill(aDefaultState)
            .forEach(new Array(FieldCount).fill(aDefaultState));
    }

    getRectByIndex(aIndex) {
        return new Rect(aIndex, this.fieldWidth);
    }

    getRectByPos(x, y) {
        return new Rect(x, y, this.fieldWidth, this.fieldWidth);
    }

    getIndexByRect(rect) {
        return new Index(rect);
    }

    getIndexByPos(x, y) {
        return new Rect(x, y, this.fieldWidth, this.fieldWidth).Index;
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
        for (let y = 0; y <= h; y += fieldHeigth) {
            this.context.moveTo(0, y);
            this.context.lineTo(w, y);
        }

        this.context.strokeStyle = this.LineColor;
        this.context.lineWidth = 1;
        this.context.stroke();    
    }

    forEachField(onItem){        
        this.fields.forEach((_arr, indexY) => {
            arr[indexY].forEach((value, indexX) => {
                return onItem(indexX, indexY, value);
            })
        });        
    }

    normalize(aValue, aNormalizer) {
        return Math.floor(aValue / aNormalizer) * aNormalizer;
    }

    resizeGrid(){
        let newWidth, newHeight;
        const canvasMargine = 0.3;
        const roundTo100 = 100;
    
        newWidth = normalize(window.innerWidth, roundTo100) - normalize(window.innerWidth * canvasMargine, roundTo100);
        newHeight = newWidth;
    
        if ((canvas.width != newWidth) && (canvas.height != newHeight) && (canvas.height <= window.innerHeight * 0.4)) {
                canvas.width = newWidth;
                canvas.height = newHeight;

                this.fields = getFieldsArray();
                this.forEachField((indexX, indexY, value) => {
                    this.drawRect(this.getRectByIndex(new Index(indexX, indexY), value));
                });       
                drawGridLines();
        }
    }

    redraw() {
        this.forEachField((x, y, value) => {
            this.drawRect(this.getRectByIndex(new Index(x, y), value));
        });
        this.drawGridLines();
    };

    drawRect(aRect, value) {
        let color = this.onState(value);

        if (color === unassigned) {
            color = this.defaultFieldColor;
        }

        this.context.fillStyle = color;

        this.context.fillRect(aRect.x, aRect.y, aRect.width, aRect.width);        
    }
}
