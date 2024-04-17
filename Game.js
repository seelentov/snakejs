import Matrix from "./models/Matrix.js"

class Game {
    constructor(config) {
        this.config = config

        this.position = null
        this.moving = null
        this.height = null

        this.interval = null
        this.renderInterval = null
        this.points = 0
        this.queue = []
        this.status = 'pending'
        this.apples = []
        this.inputQueue = []
    }
    start() {
        const x = this.config.map.x === 'full' ? Math.floor(process.stdout.columns / 2) - 1 : this.config.map.x
        const y = this.config.map.y === 'full' ? Math.floor(process.stdout.rows) - 10 : this.config.map.y
        this.map = new Matrix(x, y)

        this.position = this.config.startpos
        this.moving = this.config.startdir
        this.height = 1

        if (this.interval) clearInterval(this.interval)
        if (this.renderInterval) clearInterval(this.renderInterval)

        this.status = 'pending'

        this.points = 0
        this.queue = [[1, 1]]
        this.apples = []
        this.inputQueue = []

        this.status = 'play'
        this.createApple()
        this.actionInterval = setInterval(() => {
            this.action()
        }, 10)
        this.interval = setInterval(() => {
            this.move()
            this.calc()
        }, this.config.interval)
        this.renderInterval = setInterval(() => {
            console.clear()
            this.makeMap()
            this.render()
        }, this.config.renderInterval)

    }
    rotate(moveKey) {
        if (this.config.bannedRotating[this.moving] !== moveKey) {
            this.moving = moveKey
        }
    }
    move() {
        this.position = this.prediction()
        this.queue.unshift([...this.position])
        if (this.queue.length > this.map.size) this.queue.pop()
    }
    createApple() {
        for (let i = 0; i < this.map.size; i++) {
            const newPos = this.map.randPoint()
            if (!this.queue.slice(0, this.height).some(point => point[0] === newPos[0] && point[1] === newPos[1])) {
                this.apples.push(newPos)
                return
            }
        }
        return false
    }
    calc() {
        if (!this.map.isPointExist(this.position[0], this.position[1])) {
            if (this.config.loseOnHitByWall) {
                this.lose()
            }
        }

        const body = this.queue.slice(1, this.height)

        if ((body.some(point => point[0] === this.position[0] && point[1] === this.position[1])) && this.config.loseOnHitBySelf) {
            this.lose()
        }

        if (this.apples.some(apple => apple[0] === this.position[0] && apple[1] === this.position[1])) {
            this.apples = this.apples.filter(apple => apple[0] !== this.position[0] || apple[1] !== this.position[1])
            this.height += 1
            this.points += 1
            this.createApple()
        }
    }
    makeMap() {
        this.map.drawAll(this.config.icons.empty)



        for (let i = 0; i < this.height; i++) {
            const point = this.queue[i]
            this.map.drawOnPoint(point[0], point[1], this.config.icons.snake)
        }

        for (let i = 0; i < this.apples.length; i++) {
            const point = this.apples[i]
            this.map.drawOnPoint(point[0], point[1], this.config.icons.apple)
        }

        this.map.drawOnPoint(this.position[0], this.position[1], this.config.icons.face)

        if (this.status === 'lose') {
            const centerY = Math.ceil(this.map.rows / 2)

            const loseString = [
                'LOSE!', `RESTART? Press: [${this.config.control.restart}]`, `SCORE: ${this.points}`
            ]

            this.map.drawText(1, centerY, loseString)

            const point = this.queue[1]
            this.map.drawOnPoint(point[0], point[1], this.config.icons.tragedy)
        }
    }
    render() {
        const gameMap = this.map.map
        const renderedMap = gameMap.map(line => '|' + line.join(' ')).join('|\n') + '|'
        const renderYborders = () => console.log("--".repeat(this.map.cols) + '-')
        console.log('SCORE: ', this.points)
        renderYborders()
        console.log(renderedMap)
        renderYborders()
    }
    lose() {
        this.status = 'lose'
        if (this.interval) clearInterval(this.interval)
    }
    prediction() {
        const result = [...this.position]
        if (this.moving === 'up') {
            result[1] -= 1
        } else if (this.moving === 'left') {
            result[0] -= 1
        } else if (this.moving === 'right') {
            result[0] += 1
        } else if (this.moving === 'down') {
            result[1] += 1
        }
        return result
    }
    action() {
        if (!this.inputQueue.length) return
        const key = this.inputQueue.shift()
        const moveKeys = Object.keys(this.config.control.move)

        for (let moveKey of moveKeys) {
            if (this.config.control.move[moveKey].includes(key)) {
                this.rotate(moveKey)
            }
        }

        if (this.config.control.restart.includes(key)) {
            this.start()
        }
    }
    input(inpt) {
        this.inputQueue.push(inpt)
        if (this.inputQueue.length > 3) this.inputQueue.pop()
    }
}

export default Game