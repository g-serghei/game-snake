const io = require('socket.io')(3001);
const Snake = require('./snake');

Game = {
    speed: 8,
    boardSize: 25,
    tileSize: 20,
    snakes: [],
    tableMap: [],
    food: {
        x: 0,
        y: 0
    },
    init: function () {
        io.on('connection', this.userConnected.bind(this));

        setInterval(() => {
            this.tableMap.length = 0;

            for (let i = 0; i < this.snakes.length; i++) {
                this.snakes[i].move();
                for (let j = 0; j < this.snakes[i].coordinates.length; j++) {
                    this.tableMap.push(this.snakes[i].coordinates[j]);
                }
            }

            io.emit('render', {
                tableMap: this.tableMap
            });
        }, 1000 / this.speed);
    },
    userConnected: function(socket){
        console.log('a user connected');

        socket.snake = new Snake({
            headPosition: {
                x: Math.floor(Math.random() * this.boardSize - 1),
                y: 21
            },
            startLength: 4,
            moveDirection: 'up',
            boardSize: this.boardSize
        });

        socket.on('arrow', function (data) {
            console.log('change direction to:', data.direction);
            socket.snake.moveDirection = data.direction;
        });

        this.snakes.push(socket.snake);

        let self = this;
        socket.on('disconnect', function() {
            let index = self.snakes.indexOf(socket.snake);
            if (index === -1) {
                return;
            }

            self.snakes.splice(index, 1);
        });

    },

};


Game.init();