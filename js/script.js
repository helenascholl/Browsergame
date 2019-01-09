const V_CHARACTER = 10;
const V_BULLET = 10;
const MIN_X = 100;
const MIN_Y = 100;
const MAX_X = window.innerWidth - 100;
const MAX_Y = window.innerHeight - 100;
const VALID_KEYS = ['w', 'a', 's', 'd', 'W', 'A', 'S', 'D', ' ', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
let pressedKeys = [];
let direction = 'right';
let bulletIntervals = [];
let reloaded = true;
let bulletCounter = 0;

window.addEventListener('load', () => {
    let character = document.getElementById('character');

    character.style.top = MIN_Y;
    character.style.left = MIN_X;

    setInterval(interval, 10);
});

window.addEventListener('keyup', (element) => {
    if (VALID_KEYS.includes(element.key)) {
        pressedKeys[element.key] = false;
    }
});

window.addEventListener('keydown', (element) => {
    if (VALID_KEYS.includes(element.key)) {
        pressedKeys[element.key] = true;
    }
});

function interval() {
    if (pressedKeys['w'] || pressedKeys['W'] || pressedKeys['ArrowUp']) {
        direction = 'up';
        move();
    }
    if (pressedKeys['a'] || pressedKeys['A'] || pressedKeys['ArrowLeft']) {
        direction = 'left';
        move();
    }
    if (pressedKeys['s'] || pressedKeys['S'] || pressedKeys['ArrowDown']) {
        direction = 'down';
        move();
    }
    if (pressedKeys['d'] || pressedKeys['D'] || pressedKeys['ArrowRight']) {
        direction = 'right';
        move();
    }
    if (pressedKeys[' '] && reloaded) {
        shoot();
        reloaded = false;
        setTimeout(reload, 300);
    }
}

function move() {
    let character = document.getElementById('character');
    let top = character.style.top;
    let left = character.style.left;
    
    switch (direction) {
        case 'up':
            if (parseInt(top) - V_CHARACTER >= MIN_Y) {
                character.style.top = (parseInt(top) - V_CHARACTER) + 'px';
            } else {
                character.style.top = MIN_Y + 'px';
            }
            break;

        case 'left':
            if (parseInt(left) - V_CHARACTER >= MIN_X) {
                character.style.left = (parseInt(left) - V_CHARACTER) + 'px';
            } else {
                character.style.left = MIN_X + 'px';
            }
            break;

        case 'down':
            if (parseInt(top) + V_CHARACTER + parseInt(character.height) <= MAX_Y) {
                character.style.top = (parseInt(top) + V_CHARACTER) + 'px';
            } else {
                character.style.top = (MAX_Y - character.height) + 'px';
            }
            break;

        case 'right':
            if (parseInt(left) + V_CHARACTER + parseInt(character.width) <= MAX_X) {
                character.style.left = (parseInt(left) + V_CHARACTER) + 'px';
            } else {
                character.style.left = (MAX_X - character.width) + 'px';
            }
            break;
    }
}

function shoot() {
    let longSide = '20px';
    let shortSide = '6px';
    let character = document.getElementById('character');
    let body = document.getElementById('body');
    let bullet = document.createElement('div');

    bullet.className = 'bullet';
    bullet.direction = direction;
    bullet.number = bulletCounter;
    bullet.style.backgroundColor = 'black';
    bullet.style.position = 'absolute';
    bullet.style.top = (parseInt(character.style.top) + parseInt(character.height) / 2) + 'px';
    bullet.style.left = (parseInt(character.style.left) + parseInt(character.width) / 2) + 'px';

    if (direction == 'up' || direction == 'down') {
        bullet.style.height = longSide;
        bullet.style.width = shortSide;
    } else {
        bullet.style.height = shortSide;
        bullet.style.width = longSide;
    }

    body.appendChild(bullet);

    bulletIntervals['bullet' + bulletCounter++] = setInterval(moveBullet, 10);
}

function moveBullet() {
    let bullets = document.getElementsByClassName('bullet');

    for (let bullet of bullets) {
        let top = bullet.style.top;
        let left = bullet.style.left;

        switch (bullet.direction) {
            case 'up':
                bullet.style.top = (parseInt(top) - V_BULLET) + 'px';
                break;

            case 'left':
                bullet.style.left = (parseInt(left) - V_BULLET) + 'px';
                break;

            case 'down':
                bullet.style.top = (parseInt(top) + V_BULLET) + 'px';
                break;

            case 'right':
                bullet.style.left = (parseInt(left) + V_BULLET) + 'px';
                break;
        }

        top = parseInt(bullet.style.top);
        left = parseInt(bullet.style.left);

        if (left < MIN_X || left > MAX_X || top < MIN_Y || top > MAX_Y) {
            clearInterval(bulletIntervals['bullet' + bullet.number]);
            bulletIntervals.splice('bullet' + bullet.numer);
            document.getElementById('body').removeChild(bullet);
        }
    }
}

function reload() {
    reloaded = true;
}