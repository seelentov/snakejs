import rand from '../utils/rand.js'

class Matrix {
    constructor(x = 1, y = 1) {
        this.cols = x
        this.rows = y
        this.size = x * y
        this.map = this.makeMatrix(x, y)
    }
    makeMatrix(x, y) {
        const line = []
        const result = []
        for (let i = 1; i <= x; i++) {
            line.push('')
        }
        for (let i = 1; i <= y; i++) {
            result.push(line)
        }
        return result
    }
    isPointExist(x, y) {
        return !(x > this.cols || y > this.rows || x < 1 || y < 1)
    }
    getPoint(x, y) {
        return this.map[y - 1][x - 1].slice()
    }
    drawOnPoint(x, y, data) {
        if (!this.isPointExist(x, y)) return false

        const line = this.map[y - 1].slice()
        line[x - 1] = data

        this.map[y - 1] = line

        return this.map
    }
    drawAll(data) {
        for (let i = this.cols; i > 0; i--) {
            for (let j = this.rows; j > 0; j--) {
                this.drawOnPoint(i, j, data)
            }
        }

        return this.map
    }
    clearOnPoint(x, y) {
        if (!this.isPointExist(x, y)) return false
        const line = this.map[y - 1].slice()
        line[x - 1] = ''
        this.map[y - 1] = line
    }
    clearAll() {
        for (let i = this.cols; i > 0; i--) {
            for (let j = this.rows; j > 0; j--) {
                this.drawOnPoint(i, j, null)
            }
        }

        return this.map
    }
    randPoint() {
        return [rand(1, this.cols), rand(1, this.rows)]
    }
    drawText(startX, startY, text) {
        text.forEach((text, index) => {
            for (let i = 0; i < text.length; i++) {
                this.drawOnPoint(startX + i, startY + index, text[i])
            }
        })
    }
}

export default Matrix