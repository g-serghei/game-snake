class Snake {
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

        if (!params.hasOwnProperty('boardSize')) {
            throw new Error('Please specify board size');
        }

        this.headPosition = params.headPosition;
        this.startLength = params.startLength;
        this.moveDirection = params.moveDirection;
        this.boardSize = params.boardSize;

        this.coordinates = [this.headPosition];
        for (let i = 0; i < this.startLength; i++) {
            this.coordinates.push({
                x: this.headPosition.x,
                y: this.coordinates[this.coordinates.length - 1].y + 1
            });
        }
    }

    move() {
        let head = this.coordinates[0],
            tail = Object.assign({}, head);

        this.coordinates.splice(this.coordinates.length - 1, 1);

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

        this.coordinates.unshift(tail);
    }

}

module.exports = Snake;