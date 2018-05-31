const io = require('socket.io')(3001);
const Snake = require('./snake');
const Directions = require('./directions');

({
    speed: 8,
    boardSize: 25,
    tileSize: 20,
    snakes: [],
    food: {
        x: 0,
        y: 0,
        color: '000000'
    },
    init: function () {
        io.on('connection', this.userConnected.bind(this));

        setInterval(() => {
            let tableMap = this.getSnakesPoints();

            for (let i = 0; i < tableMap.length; i++) {
                if (tableMap[i].type === 'head') {
                    tableMap[i].color = 'ff0000';
                }
            }

            tableMap.push(this.food);

            io.emit('render', {
                tableMap: tableMap
            });
        }, 1000 / this.speed);
    },
    getRandomColor: function () {
        return Math.floor(Math.random() * 16777215).toString(16);
    },
    userConnected: function(socket) {
        console.log('user connected');

        socket.emit('configuration', {
            boardSize: this.boardSize,
            tileSize: this.tileSize
        });

        socket.snake = new Snake({
            headPosition: {
                x: Math.floor(Math.random() * this.boardSize - 1),
                y: 21
            },
            color: this.getRandomColor(),
            game: this,
            startLength: 4,
            moveDirection: Directions.UP,
            boardSize: this.boardSize
        });

        socket.on('arrow', function (data) {
            console.log('change direction to:', data.direction);
            socket.snake.moveDirection = data.direction;
        });

        this.snakes.push(socket.snake);

        this.updateFood();

        let self = this;
        socket.on('disconnect', function() {
            console.log('user disconnected');

            let index = self.snakes.indexOf(socket.snake);
            if (index === -1) {
                return;
            }

            self.snakes.splice(index, 1);
        });

    },
    getSnakesPoints: function () {
        let snakesPoints = [];

        for (let i = 0; i < this.snakes.length; i++) {
            this.snakes[i].move();
            for (let j = 0; j < this.snakes[i].coordinates.length; j++) {
                snakesPoints.push(this.snakes[i].coordinates[j]);
            }
        }

        return snakesPoints;
    },
    updateFood: function () {
        let snakesPoints = this.getSnakesPoints();
        this.food = this.getFoodPoint(snakesPoints);
    },
    getFoodPoint: function (snakesPoints) {
        let blankPoints = [];
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                for (let s = 0; s < snakesPoints.length; s++) {
                    if (snakesPoints[s].x === i && snakesPoints[s].y === j) {
                        continue;
                    }

                    blankPoints.push({x: i, y: j})
                }
            }
        }

        return blankPoints[Math.floor(Math.random() * blankPoints.length - 1)];
    }
}).init();