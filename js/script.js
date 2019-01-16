const V_BULLET = 15;
const MIN_X = 100;
const MIN_Y = 100;
const MAX_X = window.innerWidth - 100;
const MAX_Y = window.innerHeight - 100;
const VALID_KEYS = ['w', 'a', 's', 'd', 'W', 'A', 'S', 'D', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
let pressedKeys = [];
let bulletIntervals = [];
let reloaded = true;
let bulletCounter = 0;
let bulletDirection = 'right';
let player;
let body;

window.addEventListener('load', () => {
    player = document.getElementById('player');
    body = document.getElementById('body');

    player.direction = 'right';
    player.velocity = 10;
    player.style.top = MIN_Y + 'px';
    player.style.left = MIN_X + 'px';
    player.style.display = 'block';

    for (let child of body.childNodes) {
        if (child.data == '\n') {
            body.removeChild(child);
        }
    }

    setInterval(interval, 10);
    setInterval(spawnEnemy, 5000);
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
    interpretKeys();
    moveBullets();
    moveEnemies();
}

function interpretKeys() {
    if (pressedKeys['w'] || pressedKeys['W']) {
        player.direction = 'up';
        move(player);
    }
    if (pressedKeys['a'] || pressedKeys['A']) {
        player.direction = 'left';
        move(player);
    }
    if (pressedKeys['s'] || pressedKeys['S']) {
        player.direction = 'down';
        move(player);
    }
    if (pressedKeys['d'] || pressedKeys['D']) {
        player.direction = 'right';
        move(player);
    }
    if (pressedKeys['ArrowUp'] && reloaded) {
        bulletDirection = 'up';
        reloaded = false;
        setTimeout(reload, 300);
        shoot();
    }
    if (pressedKeys['ArrowLeft'] && reloaded) {
        bulletDirection = 'left';
        reloaded = false;
        setTimeout(reload, 300);
        shoot();
    }
    if (pressedKeys['ArrowDown'] && reloaded) {
        bulletDirection = 'down';
        reloaded = false;
        setTimeout(reload, 300);
        shoot();
    }
    if (pressedKeys['ArrowRight'] && reloaded) {
        bulletDirection = 'right';
        reloaded = false;
        setTimeout(reload, 300);
        shoot();
    }
}

function move(character) {
    let top = character.style.top;
    let left = character.style.left;
    
    switch (character.direction) {
        case 'up':
            if (parseInt(top) - character.velocity >= MIN_Y) {
                character.style.top = (parseInt(top) - character.velocity) + 'px';
            } else {
                character.style.top = MIN_Y + 'px';
            }
            break;

        case 'left':
            if (parseInt(left) - character.velocity >= MIN_X) {
                character.style.left = (parseInt(left) - character.velocity) + 'px';
            } else {
                character.style.left = MIN_X + 'px';
            }
            break;

        case 'down':
            if (parseInt(top) + character.velocity + parseInt(character.height) <= MAX_Y) {
                character.style.top = (parseInt(top) + character.velocity) + 'px';
            } else {
                character.style.top = (MAX_Y - character.height) + 'px';
            }
            break;

        case 'right':
            if (parseInt(left) + character.velocity + parseInt(character.width) <= MAX_X) {
                character.style.left = (parseInt(left) + character.velocity) + 'px';
            } else {
                character.style.left = (MAX_X - character.width) + 'px';
            }
            break;
    }
}

function shoot() {
    let longSide = '20px';
    let shortSide = '6px';
    let bullet = document.createElement('div');

    bullet.className = 'bullet';
    bullet.direction = bulletDirection;
    bullet.number = bulletCounter;
    bullet.style.backgroundColor = 'black';
    bullet.style.position = 'absolute';
    bullet.style.top = (parseInt(player.style.top) + parseInt(player.height) / 2) + 'px';
    bullet.style.left = (parseInt(player.style.left) + parseInt(player.width) / 2) + 'px';

    if (bullet.direction == 'up' || bullet.direction == 'down') {
        bullet.style.height = longSide;
        bullet.style.width = shortSide;
    } else {
        bullet.style.height = shortSide;
        bullet.style.width = longSide;
    }

    body.appendChild(bullet);
}

function moveBullets() {
    for (let bullet of document.getElementsByClassName('bullet')) {
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

        for (let enemy of document.getElementsByClassName('enemy')) {
            let bulletLeft = parseInt(bullet.style.left);
            let bulletTop = parseInt(bullet.style.top);
            let enemyLeft = parseInt(bullet.style.left);
            let enemyTop = parent(bullet.style.left);

            let collision = bulletLeft + parseInt(bullet.style.width) >= enemyLeft
                            && bulletLeft <= enemyLeft + parseInt(enemy.width)
                            && bulletTop + parseInt(bullet.style.height) >= enemyTop
                            && bulletTop <= enemyTop + parseInt(enemy.height);

            if (collision) {
                body.removeChild(enemy);
                body.removeChild(bullet);
            }
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

function spawnEnemy() {
    let enemy = document.createElement('img');
    let isTooClose = false;

    enemy.src = './img/enemy.png';
    enemy.alt = 'enemy';
    enemy.height = player.height;
    enemy.width = player.width;
    enemy.className = 'enemy';
    enemy.direction = 'left';
    enemy.velocity = 3;
    enemy.style.position = 'absolute';

    do {
        let distanceX;
        let distanceY;

        enemy.style.top = (parseInt(Math.random() * (MAX_Y - MIN_Y)) + MIN_Y) + 'px';
        enemy.style.left = (parseInt(Math.random() * (MAX_X - MIN_X)) + MIN_X) + 'px';

        distanceX = Math.abs(parseInt(player.style.left) - parseInt(enemy.style.left));
        distanceY = Math.abs(parseInt(player.style.top) - parseInt(enemy.style.top));

        if (distanceY < (MAX_Y - MIN_Y) / 4 && distanceX < (MAX_X - MIN_X) / 4) {
            isTooClose = true;
        }

        for (let element of document.getElementsByClassName('enemy')) {
            distanceX = Math.abs(parseInt(element.style.left) - parseInt(enemy.style.left));
            distanceY = Math.abs(parseInt(element.style.top) - parseInt(enemy.style.top));
            
            if (distanceY < element.height && distanceX < element.width) {
                isTooClose = true;
            }
        }
    } while (isTooClose);

    document.getElementById('body').appendChild(enemy);
}

function moveEnemies() {
    for (let enemy of document.getElementsByClassName('enemy')) {
        let distanceX = parseInt(player.style.left) - parseInt(enemy.style.left);
        let distanceY = parseInt(player.style.top) - parseInt(enemy.style.top);

        if (distanceX > 0 && distanceY > 0) {
            if (distanceX > distanceY) {
                enemy.direction = 'right';
            } else {
                enemy.direction = 'down';
            }
        } else if (distanceX > 0 && distanceY < 0) {
            if (distanceX > Math.abs(distanceY)) {
                enemy.direction = 'right';
            } else {
                enemy.direction = 'up';
            }
        } else if (distanceX < 0 && distanceY > 0) {
            if (Math.abs(distanceX) > distanceY) {
                enemy.direction = 'left';
            } else {
                enemy.direction = 'down';
            }
        } else if (distanceX < distanceY) {
            enemy.direction = 'left';
        } else {
            enemy.direction = 'up';
        }

        move(enemy);
    }
}

function detectCollision() {

}