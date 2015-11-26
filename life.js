var Life = function(params){
    this.ctx = params.element.getContext('2d');
    this.width = params.width;
    this.height = params.height;
    this.cellSize = params.cellSize;
    this.turnTime = params.turnTime;
    this.randomThreshold = params.randomThreshold;

    this.state = [];
    this.stateNext = [];
    this.time = 0;
    this.rafId = null;

    this.generateStartingState();
    this.drawState();
    this.makeTurn();
};

Life.prototype.makeTurn = function(timestamp){
    if (timestamp - this.time > this.turnTime) {
        this.time = timestamp;
        this.calculateTurn();
        this.drawState();
    }
    this.rafId = requestAnimationFrame(this.makeTurn.bind(this));
};

Life.prototype.generateStartingState = function(){
    var column, randomCellState;
    var x, y;
    for (x = 0; x < this.width; x++) {
        this.state.push([]);
        column = this.state[x];
        for (y = 0; y < this.height; y++) {
            randomCellState = (Math.random() >= this.randomThreshold) ? 1 : 0;
            column.push(randomCellState);
        }
        this.stateNext.push(Array(this.height));
    }
};

Life.prototype.calculateTurn = function(){
    var neigbours, state;
    for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
            neigbours = this.getAliveNeighbours(x, y);
            state = this.state[x][y];
            this.stateNext.push(Array(this.height));
            // в пустой (мёртвой) клетке, рядом с которой ровно три живые клетки, зарождается жизнь
            if (state === 0 && neigbours === 3) {
                this.stateNext[x][y] = 1;
            }
            // если у живой клетки есть две или три живые соседки, то эта клетка продолжает жить
            else if (state === 1 && (neigbours === 3 || neigbours === 2)) {
                this.stateNext[x][y] = 1;
            }
            // в противном случае (если соседей меньше двух или больше трёх) клетка умирает («от одиночества» или «от перенаселённости»)
            else {
                this.stateNext[x][y] = 0;
            }
        }
    }
    this.state = this.stateNext;
    this.stateNext = [];
};

Life.prototype.drawState = function(timestamp){
    var state;
    var x, y;
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0,0, this.width * this.cellSize, this.height * this.cellSize);
    this.ctx.fillStyle = '#000';

    for (x = 0; x < this.width; x++) {
        for (y = 0; y < this.height; y++) {
            state = this.state[x][y];
            if (state){
                this.ctx.fillRect(
                    x * this.cellSize, y * this.cellSize,
                    this.cellSize, this.cellSize
                );
            }
        }
    }
};

Life.prototype.getCell = function(x, y){
    if (x >= this.width) {
        x = this.width - x;
    }
    if (y >= this.height) {
        y = this.height - y;
    }
    if (x < 0) {
        x = this.width + x;
    }
    if (y < 0) {
        y = this.height + y;
    }
    return this.state[x][y];
};

Life.prototype.getAliveNeighbours = function(x, y){
    var neigbours = [
        this.getCell(x - 1, y + 1), this.getCell(x, y + 1), this.getCell(x + 1, y + 1),
        this.getCell(x - 1, y),                             this.getCell(x + 1, y),
        this.getCell(x - 1, y - 1), this.getCell(x, y - 1), this.getCell(x + 1, y - 1)
    ];
    return neigbours.reduce(function(prev, curr){ return prev + curr; }, 0);
};

var l = new Life({
    element: document.querySelector('#canvas'), // node
    cellSize: 2, // pixels
    width: 400, // cells
    height: 300, // cells
    turnTime: 2000, // ms,
    randomThreshold: 0.5 // chance
});
