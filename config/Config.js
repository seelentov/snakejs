class Config {
    constructor() {
        this.map = {
            x: 20,
            y: 20
        }

        this.icons = {
            empty: ' ',
            apple: 'A',
            snake: '0',
            face: '9',
            tragedy: 'X'
        }

        this.interval = 50
        this.renderInterval = 32

        this.startpos = [1, 1]
        this.startdir = 'right'

        this.loseOnHitByWall = true
        this.loseOnHitBySelf = false

        this.bannedRotating = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        }

        this.control = {
            restart: ['return', 'r'],
            move: {
                up: ['w'],
                down: ['s'],
                left: ['a'],
                right: ['d']
            }
        }
    }

}

export default new Config()