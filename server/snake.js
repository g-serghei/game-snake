const Directions = require('./directions');

module.exports = class Snake {

    constructor(params) {
        if (!params.hasOwnProperty('headPosition')) {
            throw new Error('Please specify head position');
        }

        if (!params.hasOwnProperty('startLength')) {
            throw new Error('Please specify length');
        }

        if (!params.hasOwnProperty('moveDirection')) {
            throw new Error('Please specify move direction');
        }

        if (!params.hasOwnProperty('game')) {
            throw new Error('Please specify game instance');
        }

        if (!params.hasOwnProperty('color')) {
            throw new Error('Please specify game instance');
        }

        this.headPosition = params.headPosition;
        this.startLength = params.startLength;
        this.moveDirection = params.moveDirection;
        this.game = params.game;
        this.color = params.color;
        this.boardSize = params.game.boardSize;

        this.headPosition.color = this.color;
        this.coordinates = [this.headPosition];
        for (let i = 0; i < this.startLength; i++) {
            this.coordinates.push({
                x: this.headPosition.x,
                y: this.coordinates[this.coordinates.length - 1].y + 1,
                color: this.color
            });
        }
    }

    move() {
        let head = this.coordinates[0],
            tail = Object.assign({}, head);

        this.coordinates.splice(this.coordinates.length - 1, 1);

        switch (this.moveDirection) {
            case Directions.UP:
                tail.y = (head.y === 0 ? this.boardSize : head.y) - 1;
                break;
            case Directions.DOWN:
                tail.y = (head.y === this.boardSize - 1 ? -1 : head.y) + 1;
                break;
            case Directions.LEFT:
                tail.x = (head.x === 0 ? this.boardSize : head.x) - 1;
                break;
            case Directions.RIGHT:
                tail.x = (head.x === this.boardSize - 1 ? -1 : head.x) + 1;
                break;
        }

        delete this.coordinates[0].type;
        this.coordinates[0].color = this.color;
        tail.color = this.color;
        tail.type = 'head';
        this.coordinates.unshift(tail);

        if (Snake.samePoint(this.game.food, tail)) {
            this.feedSnake();
            this.game.updateFood();
        }
    }

    feedSnake() {
        let head = this.coordinates[0],
            tail = Object.assign({}, this.game.food);

        tail.color = this.color;

        switch (this.moveDirection) {
            case Directions.UP:
                tail.y = (head.y === 0 ? this.boardSize : head.y) - 1;
                break;
            case Directions.DOWN:
                tail.y = (head.y === this.boardSize - 1 ? -1 : head.y) + 1;
                break;
            case Directions.LEFT:
                tail.x = (head.x === 0 ? this.boardSize : head.x) - 1;
                break;
            case Directions.RIGHT:
                tail.x = (head.x === this.boardSize - 1 ? -1 : head.x) + 1;
                break;
        }

        delete this.coordinates[0].type;
        tail.type = 'head';
        this.coordinates.unshift(tail);
    }

    static samePoint(a, b) {
        return a.x === b.x && a.y === b.y;
    }
};