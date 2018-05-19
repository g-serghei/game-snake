Directions = {
    RIGHT: 'right',
    DOWN: 'down',
    UP: 'up',
    LEFT: 'left'
};

Game = {
    ctx: null,
    canvas: null,
    socket: null,
    boardSize: 25,
    tileSize: 20,
    init: function () {
        this.canvas = document.getElementById('snake-canvas');
        if (!this.canvas.getContext) {
            return;
        }

        let sceneSize = this.boardSize * this.tileSize;
        this.canvas.width = sceneSize;
        this.canvas.height = sceneSize;
        this.ctx = this.canvas.getContext('2d');

        console.log('try to connect');
        this.socket = io('http://192.168.1.25:3001');

        document.onkeydown = this.listenArrows.bind(this);

        let self = this;
        this.socket.on('render', function (data) {
            console.log('render');
            self.renterBoard(data.tableMap);
        })
    },
    listenArrows: function (e) {
        e = e || window.event;

        let keyMap = {
            38: Directions.UP,
            40: Directions.DOWN,
            37: Directions.LEFT,
            39: Directions.RIGHT
        };

        let direction = keyMap[e.keyCode];
        if (!direction) {
            return
        }

        let isOldVerticalMove = this.moveDirection === Directions.DOWN || this.moveDirection === Directions.UP;
        let isOldHorizontalMove = this.moveDirection === Directions.RIGHT || this.moveDirection === Directions.LEFT;

        let isNewVerticalMove = direction === Directions.DOWN || direction === Directions.UP;
        let isNewHorizontalMove = direction === Directions.RIGHT || direction === Directions.LEFT;

        if (direction === this.moveDirection || (isOldVerticalMove && isNewVerticalMove) || (isOldHorizontalMove && isNewHorizontalMove)) {
            return;
        }

        this.moveDirection = direction;
        this.socket.emit('arrow', {
            direction: direction
        });
    },
    updateFood() {
        let freeCellsCount = Math.pow(this.boardSize, 2) - this.snakeCoordinates.length;
        let randomCellNumber = Math.floor(Math.random() * freeCellsCount);

        let i = 0;
        for (let x = 0; x < this.boardSize && i <= randomCellNumber; x++) {
            for (let y = 0; y < this.boardSize && i <= randomCellNumber; y++) {
                if (this.snakeCoordinates.find(c => c.x === x && c.y === y) !== undefined) {
                    continue;
                }

                if (randomCellNumber === i) {
                    this.food.x = x;
                    this.food.y = y;
                }

                i = i + 1;
            }
        }
    },
    moveSnake() {
        let head = this.snakeCoordinates[0],
            tail = Object.assign({}, head);

        this.snakeCoordinates.splice(this.snakeCoordinates.length - 1, 1);

        switch (this.moveDirection) {
            case 'up':
                tail.y = (head.y === 0 ? this.boardSize : head.y) - 1;
                break;
            case 'down':
                tail.y = (head.y === this.boardSize - 1 ? -1 : head.y) + 1;
                break;
            case 'left':
                tail.x = (head.x === 0 ? this.boardSize : head.x) - 1;
                break;
            case 'right':
                tail.x = (head.x === this.boardSize - 1 ? -1 : head.x) + 1;
                break;
        }

        this.snakeCoordinates.unshift(tail);

        if (this.samePoint(this.food, tail)) {
            this.feedSnake();
            this.updateFood();
        }
    },
    feedSnake: function () {
        let head = this.snakeCoordinates[0],
            tail = Object.assign({}, this.food);

        switch (this.moveDirection) {
            case 'up':
                tail.y = (head.y === 0 ? this.boardSize : head.y) - 1;
                break;
            case 'down':
                tail.y = (head.y === this.boardSize - 1 ? -1 : head.y) + 1;
                break;
            case 'left':
                tail.x = (head.x === 0 ? this.boardSize : head.x) - 1;
                break;
            case 'right':
                tail.x = (head.x === this.boardSize - 1 ? -1 : head.x) + 1;
                break;
        }

        this.snakeCoordinates.unshift(tail);
    },
    samePoint: function (a, b) {
        return a.x === b.x && a.y === b.y;
    },
    renterBoard: function (tableMap) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let x = 0; x < this.boardSize; x++) {
            for (let y = 0; y < this.boardSize; y++) {
                this.ctx.strokeRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
            }
        }

        for (let i = 0; i < tableMap.length; i++) {
            this.pointOn(tableMap[i].x, tableMap[i].y);
        }

        //this.pointOn(this.food.x, this.food.y);
    },
    pointOn: function (x, y) {
        this.ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
    },
    clearPoint: function (x, y) {
        this.ctx.clearRect((x * this.tileSize) + 1, (y * this.tileSize) + 1, this.tileSize - 2, this.tileSize - 2);
    }
};