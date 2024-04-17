import Config from "./config/Config.js"
import Game from "./Game.js"
import readline from "readline";

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY)
    process.stdin.setRawMode(true);

const game = new Game(Config)

process.stdin.on('keypress', (chunk, key) => {
    if (key?.name) {
        game.input(key?.name)
    }
    if (key && key.sequence == '\x03')
        process.exit();
});

game.start()