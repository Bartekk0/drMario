// Basic styles
function style() {
    const body = document.querySelector("body");
    body.style =
        "display: flex; justify-content: center; align-items: center; overflow: hidden; height: 100vh; margin: 0; background: #181a1b; color: #8b8272; font-family: 'Press Start 2P', cursive; font-size: 16px;";
    // body.style.background = '#181a1b';

    const canvas = document.querySelector(".game-canvas");
    canvas.style.border = "2px solid #8b8272";
    canvas.style.background = "#8b82721f";
}
export default style;
