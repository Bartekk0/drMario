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

const newGame = new Game(speed);
newGame.start();

export default newGame;

