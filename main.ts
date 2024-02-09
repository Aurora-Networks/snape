enum Dir { Up = 0, Down, Left, Right }

let gameSpeed = 1000;
let gameRunning = false;
let allowInput = true;
let currentDirection: Dir;
let currentX: number
let currentY: number
let dotX: number
let dotY: number
let score: number
let snakePartsX: number[]
let snakePartsY: number[]
resetGame()

basic.forever(() => {
    if (gameRunning) {
        let nextX = currentX;
        let nextY = currentY;
        switch (currentDirection) {
            case Dir.Up:
                nextY--;
                break;
            case Dir.Right:
                nextX++;
                break;
            case Dir.Down:
                nextY++;
                break;
            case Dir.Left:
                nextX--;
                break;
        }
        // check to see if we hit the wall
        if (nextX < 0 || nextX > 4 || nextY < 0 || nextY > 4) {
            loseGame();
        } else if (!hitDot(nextX, nextY) && led.point(nextX, nextY)) {
            // we hit ourself 
            loseGame();
        } else {
            currentX = nextX;
            currentY = nextY;
            led.plot(currentX, currentY)
            snakePartsX.push(currentX);
            snakePartsY.push(currentY);
            if (hitDot(currentX, currentY)) {
                score++
                getNewDot()
                if (score % 2 == 0 && gameSpeed > 100) {
                    gameSpeed = gameSpeed - 100
                } else {
                    dropTail();
                }
            } else {
                dropTail();
            }
        }
    }

    basic.pause(gameSpeed)
})

input.onButtonPressed(Button.A, () => {
    if (!allowInput)
        return;
    if (!gameRunning) {
        gameRunning = true;
        return;
    }

    switch (currentDirection) {
        case Dir.Up:
            currentDirection = Dir.Left;
            break;
        case Dir.Right:
            currentDirection = Dir.Up;
            break;
        case Dir.Down:
            currentDirection = Dir.Right;
            break;
        case Dir.Left:
            currentDirection = Dir.Down;
            break;
    }
})

input.onButtonPressed(Button.B, () => {
    if (!allowInput)
        return;
    if (!gameRunning) {
        gameRunning = true;
        return;
    }

    switch (currentDirection) {
        case Dir.Up:
            currentDirection = Dir.Right;
            break;
        case Dir.Right:
            currentDirection = Dir.Down;
            break;
        case Dir.Down:
            currentDirection = Dir.Left;
            break;
        case Dir.Left:
            currentDirection = Dir.Up;
            break;
    }
})

function loseGame() {
    allowInput = false;
    gameRunning = false;
    //basic.showIcon(IconNames.No)
    basic.showAnimation(`
        #####.........................#####
        #####.###.................###.#####
        #####.###...#.........#...###.#####
        #####.###.................###.#####
        #####.........................#####
        `, 300)
    basic.pause(300)
    basic.showIcon(IconNames.Skull)
    basic.pause(300)
    basic.showNumber(score, 100)
    basic.pause(2000)
    resetGame()
}
function resetGame() {
    basic.clearScreen()
    gameSpeed = 1000
    currentDirection = Dir.Right;
    currentX = 0
    currentY = 2
    snakePartsX = [0]
    snakePartsY = [2]
    led.plot(currentX, currentY)
    getNewDot()
    score = 0
    allowInput = true
}
function getNewDot() {
    let pt = getNotLit()
    dotX = pt.X;
    dotY = pt.Y;
    led.plot(dotX, dotY)
}
function getNotLit(): { X: number, Y: number } {
    let x = Math.randomRange(0, 5);
    let y = Math.randomRange(0, 5);
    while (led.point(x, y)) {
        x = Math.randomRange(0, 5)
        y = Math.randomRange(0, 5)
    }
    return { X: x, Y: y }
}
function hitDot(x: number, y: number): boolean {
    return x == dotX && y == dotY;
}
function dropTail() {
    led.unplot(snakePartsX[0], snakePartsY[0]);
    snakePartsX.shift();
    snakePartsY.shift();
}

