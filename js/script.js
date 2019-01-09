const STEP_SIZE = 10;
let keyState = [];

const up = ['w', 'W', 'ArrowUp'];
const left = ['a', 'A', 'ArrowLeft'];
const down = ['s', 'S', 'ArrowDown'];
const right = ['d', 'D', 'ArrowRight'];

window.addEventListener('keyup', (e) => {
    keyState[e.key] = false
    //lastKey = '';
});
window.addEventListener('keydown', (e) => {
    keyState[e.key] = true;
    /*let character = document.getElementById('character');

    

    let upAndLeft = up.includes(e.key) && left.includes(lastKey) || up.includes(lastKey) && left.includes(e.key);
    let upAndRight = up.includes(e.key) && right.includes(lastKey) || up.includes(lastKey) && right.includes(e.key);
    let downAndLeft = down.includes(e.key) && left.includes(lastKey) || down.includes(lastKey) && left.includes(e.key);
    let downAndRight = down.includes(e.key) && right.includes(lastKey) || down.includes(lastKey) && right.includes(e.key);

    if (upAndLeft) {
        let top = character.style.top;
        let left = character.style.left;

        character.style.top = (parseInt(top.substring(0, top.length - 2)) - STEP_SIZE) + 'px';
        character.style.left = (parseInt(left.substring(0, left.length - 2)) - STEP_SIZE) + 'px';
    } else if (upAndRight) {
        let top = character.style.top;
        let left = character.style.left;

        character.style.top = (parseInt(top.substring(0, top.length - 2)) - STEP_SIZE) + 'px';
        character.style.left = (parseInt(left.substring(0, left.length - 2)) + STEP_SIZE) + 'px';
    } else if (downAndLeft) {
        let top = character.style.top;
        let left = character.style.left;

        character.style.top = (parseInt(top.substring(0, top.length - 2)) + STEP_SIZE) + 'px';
        character.style.left = (parseInt(left.substring(0, left.length - 2)) - STEP_SIZE) + 'px';
    } else if (downAndRight) {
        let top = character.style.top;
        let left = character.style.left;

        character.style.top = (parseInt(top.substring(0, top.length - 2)) + STEP_SIZE) + 'px';
        character.style.left = (parseInt(left.substring(0, left.length - 2)) + STEP_SIZE) + 'px';
    } else if (up.includes(e.key)) {
        let top = character.style.top;
        character.style.top = (parseInt(top.substring(0, top.length - 2)) - STEP_SIZE) + 'px';
        
        lastKey = e.key;
    } else if (left.includes(e.key)) {
        let left = character.style.left;
        character.style.left = (parseInt(left.substring(0, left.length - 2)) - STEP_SIZE) + 'px';
        
        lastKey = e.key;
    } else if (down.includes(e.key)) {
        let top = character.style.top;
        character.style.top = (parseInt(top.substring(0, top.length - 2)) + STEP_SIZE) + 'px';
        
        lastKey = e.key;
    } else if (right.includes(e.key)) {
        let left = character.style.left;
        character.style.left = (parseInt(left.substring(0, left.length - 2)) + STEP_SIZE) + 'px';

        lastKey = e.key;
    }*/
});

function loop() {
    let character = document.getElementById('character');

    for (let i in up)

    if (keyState['w'] || keyState['W'] || keyState['ArrowUp']) {
        let top = character.style.top;
        character.style.top = (parseInt(top.substring(0, top.length - 2)) - STEP_SIZE) + 'px';
    }
    if (keyState['a'] || keyState['A'] || keyState['ArrowLeft']) {
        let left = character.style.left;
        character.style.left = (parseInt(left.substring(0, left.length - 2)) - STEP_SIZE) + 'px';
    }
    if (keyState['s'] || keyState['S'] || keyState['ArrowDown']) {
        let top = character.style.top;
        character.style.top = (parseInt(top.substring(0, top.length - 2)) + STEP_SIZE) + 'px';
    }
    if (keyState['d'] || keyState['D'] || keyState['ArrowRight']) {
        let left = character.style.left;
        character.style.left = (parseInt(left.substring(0, left.length - 2)) + STEP_SIZE) + 'px';
    }

    setTimeout(loop, 10);
}
loop();
//window.addEventListener('load', loop());