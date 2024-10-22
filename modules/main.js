import Game from "./game.js";

const speeds = {
    low: 600,
    med: 400,
    hi: 300,
};

const ls = localStorage.getItem("MarioSpeed");

let speed = speeds["low"];
if (ls) {
    speed = speeds[ls];
} else {
    speed = speeds["low"];
    localStorage.setItem("MarioSpeed", "low");
}

// ZMIEŃ NA FALSE ABY WYŁĄCZYĆ ALERT Z INSTUKCJAMI <----------------------------
const info = true;

const newGame = new Game(speed, info);
newGame.start();

export default newGame;

