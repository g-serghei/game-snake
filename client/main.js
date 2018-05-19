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
    boardSize: null,
    tileSize: null,
    init: function (configuration) {
        this.boardSize = configuration.boardSize;
        this.tileSize = configuration.tileSize;
        this.socket = configuration.socket;

        this.canvas = document.getElementById('snake-canvas');
        if (!this.canvas.getContext) {
            return;
        }

        let sceneSize = this.boardSize * this.tileSize;
        this.canvas.width = sceneSize;
        this.canvas.height = sceneSize;
        this.ctx = this.canvas.getContext('2d');

        document.onkeydown = this.listenArrows.bind(this);

        this.socket.on('render', this.render.bind(this));
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
    render: function (data) {
        let tableMap = data.tableMap;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let x = 0; x < this.boardSize; x++) {
            for (let y = 0; y < this.boardSize; y++) {
                this.ctx.strokeRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
            }
        }

        for (let i = 0; i < tableMap.length; i++) {
            this.pointOn(tableMap[i].x, tableMap[i].y, tableMap[i].color);
            console.log(tableMap[i].color);
        }
    },
    pointOn: function (x, y, color) {
        color = color || '000000';
        this.ctx.fillStyle = '#' + color;
        this.ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
    }
};

let socket = io('http://192.168.1.25:3001');
socket.on('configuration', function (configuration) {
    configuration.socket = socket;
    console.log('configuration', configuration);
    Game.init(configuration);
});