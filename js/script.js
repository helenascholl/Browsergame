const V_BULLET = 15;
const V_PLAYER = 10;
const V_ENEMY = 3;
const MIN_X = 100;
const MIN_Y = 100;
const MAX_X = window.innerWidth - 100;
const MAX_Y = window.innerHeight - 100;
const VALID_KEYS = ['w', 'a', 's', 'd', 'W', 'A', 'S', 'D', ' ', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
let CHARACTER_WIDTH = 30;
let CHARACTER_HEIGHT = 53;
let player;
let body;
let pressedKeys = [];
let bulletIntervals = [];
let reloaded = true;
let bulletCounter = 0;

window.addEventListener('load', () => {
    //let div = document.createElement('div');

    body = document.getElementById('body');

    /*div.style.display = 'none';
    for (let i = 0; i <= 8; i++) {
        let player_up = document.createElement('img');
        let player_left = document.createElement('img');
        let player_down = document.createElement('img');
        let player_right = document.createElement('img');
        let enemy_up = document.createElement('img');
        let enemy_left = document.createElement('img');
        let enemy_down = document.createElement('img');
        let enemy_right = document.createElement('img');

        player_up.src = './img/player/up' + i + '.png';
        player_left.src = './img/player/left' + i + '.png';
        player_down.src = './img/player/down' + i + '.png';
        player_right.src = './img/player/right' + i + '.png';
        enemy_up.src = './img/enemy/up' + i + '.png';
        enemy_left.src = './img/enemy/left' + i + '.png';
        enemy_down.src = './img/enemy/down' + i + '.png';
        enemy_right.src = './img/enemy/right' + i + '.png';

        div.appendChild(player_up);
        div.appendChild(player_left);
        div.appendChild(player_down);
        div.appendChild(player_right);
        div.appendChild(enemy_up);
        div.appendChild(enemy_left);
        div.appendChild(enemy_down);
        div.appendChild(enemy_right);
    }
    body.appendChild(div);*/

    player = document.createElement('div');
    player.style.height = CHARACTER_HEIGHT + 'px';
    player.style.width = CHARACTER_WIDTH + 'px';
    player.style.backgroundImage = 'url(./img/player.png)';
    player.style.backgroundPositionX = '0px';
    player.style.backgroundPositionY = CHARACTER_HEIGHT + 'px';
    player.direction = 'right';
    player.velocity = V_PLAYER;
    player.style.top = MIN_Y + 'px';
    player.style.left = MIN_X + 'px';

    body.appendChild(player);

    /*for (let child of body.childNodes) {
        if (child.data == '\n') {
            body.removeChild(child);
        }
    }*/

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
    //animateCharacters();
    interpretKeys();
    moveBullets();
    moveEnemies();
}

function interpretKeys() {
    if (pressedKeys['w'] || pressedKeys['W'] || pressedKeys['ArrowUp']) {
        player.direction = 'up';
        move(player);
    }
    if (pressedKeys['a'] || pressedKeys['A'] || pressedKeys['ArrowLeft']) {
        player.direction = 'left';
        move(player);
    }
    if (pressedKeys['s'] || pressedKeys['S'] || pressedKeys['ArrowDown']) {
        player.direction = 'down';
        move(player);
    }
    if (pressedKeys['d'] || pressedKeys['D'] || pressedKeys['ArrowRight']) {
        player.direction = 'right';
        move(player);
    }
    if (pressedKeys[' '] && reloaded) {
        shoot(player);
        reloaded = false;
        setTimeout(reload, 300);
    }
}

function move(character) {
    let top = parseInt(character.style.top);
    let left = parseInt(character.style.left);
    
    switch (character.direction) {
        case 'up':
            if (top - character.velocity >= MIN_Y) {
                character.style.top = (top - character.velocity) + 'px';
            } else {
                character.style.top = MIN_Y + 'px';
            }
            break;

        case 'left':
            if (left - character.velocity >= MIN_X) {
                character.style.left = (left - character.velocity) + 'px';
            } else {
                character.style.left = MIN_X + 'px';
            }
            break;

        case 'down':
            if (top + character.velocity + parseInt(character.style.height) <= MAX_Y) {
                character.style.top = (top + character.velocity) + 'px';
            } else {
                character.style.top = (MAX_Y - character.style.height) + 'px';
            }
            break;

        case 'right':
            if (left + character.velocity + parseInt(character.style.width) <= MAX_X) {
                character.style.left = (left + character.velocity) + 'px';
            } else {
                character.style.left = (MAX_X - character.style.width) + 'px';
            }
            break;
    }

    animate(character);
}

function shoot() {
    let longSide = '20px';
    let shortSide = '6px';
    let bullet = document.createElement('div');

    bullet.className = 'bullet';
    bullet.direction = player.direction;
    bullet.number = bulletCounter;
    bullet.style.backgroundColor = 'black';
    bullet.style.position = 'absolute';
    bullet.style.top = (parseInt(player.style.top) + parseInt(player.style.height) / 2) + 'px';
    bullet.style.left = (parseInt(player.style.left) + parseInt(player.style.width) / 2) + 'px';

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

        top = parseInt(bullet.style.top);
        left = parseInt(bullet.style.left);

        if (left < MIN_X || left > MAX_X || top < MIN_Y || top > MAX_Y) {
            clearInterval(bulletIntervals['bullet' + bullet.number]);
            bulletIntervals.splice('bullet' + bullet.numer);
            body.removeChild(bullet);
        }
    }
}

function reload() {
    reloaded = true;
}

function spawnEnemy() {
    let enemy = document.createElement('div');
    let isTooClose = false;
    let top;
    let left;

    enemy.style.width = CHARACTER_WIDTH + 'px';
    enemy.style.height = CHARACTER_HEIGHT + 'px';
    enemy.style.backgroundImage = 'url(./img/enemy.png)';
    enemy.style.backgroundPositionX = '0px';
    enemy.style.backgroundPositionY = (3 * CHARACTER_HEIGHT) + 'px';
    enemy.direction = 'left';
    enemy.velocity = V_ENEMY;
    enemy.className = 'enemy';

    /*
    player = document.createElement('div');
    player.style.height = CHARACTER_HEIGHT + 'px';
    player.style.width = CHARACTER_WIDTH + 'px';
    player.style.backgroundImage = 'url(./img/player.png)';
    player.style.backgroundPositionX = '0px';
    player.style.backgroundPositionY = CHARACTER_HEIGHT + 'px';
    player.direction = 'right';
    player.velocity = V_PLAYER;
    player.style.top = MIN_Y + 'px';
    player.style.left = MIN_X + 'px';
    */

    do {
        let distanceY;
        let distanceX;

        top = parseInt(Math.random() * (MAX_Y - MIN_Y) + MIN_Y);
        left = parseInt(Math.random() * (MAX_X - MIN_X) + MIN_X);

        distanceY = Math.abs(parseInt(player.style.top) - top);
        distanceX = Math.abs(parseInt(player.style.left) - left);

        if (distanceY < (MAX_Y - MIN_Y) / 4 && distanceX < (MAX_X - MIN_X) / 4) {
            isTooClose = true;
        }

        for (let element of document.getElementsByClassName('enemy')) {
            distanceY = Math.abs(parseInt(element.style.top) - top);
            distanceX = Math.abs(parseInt(element.style.left) - left);
            
            if (distanceY < element.height && distanceX < element.width) {
                isTooClose = true;
            }
        }
    } while (isTooClose);

    enemy.style.top = top + 'px';
    enemy.style.left = left + 'px';

    body.appendChild(enemy);
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
            if (distanceX > distanceY * -1) {
                enemy.direction = 'right';
            } else {
                enemy.direction = 'up';
            }
        } else if (distanceX < 0 && distanceY > 0) {
            if (distanceX * -1 > distanceY) {
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

function animate(character) {
    let y = parseInt(character.style.backgroundPositionY);

    switch (character.direction) {
        case 'up':
            if (y != 0) {
                character.style.backgroundPositionY = '0px';
                character.style.backgroundPositionX = '0px';
            } else {
                moveBackgroundImage(character);
            }
            break;

        case 'left':
            if (y != 3 * CHARACTER_HEIGHT) {
                character.style.backgroundPositionY = (3 * CHARACTER_HEIGHT) + 'px';
                character.style.backgroundPositionX = '0px';
            } else {
                moveBackgroundImage(character);
            }
            break;

        case 'down':
            if (y != 2 * CHARACTER_HEIGHT) {
                character.style.backgroundPositionY = (2 * CHARACTER_HEIGHT) + 'px';
                character.style.backgroundPositionX = '0px';
            } else {
                moveBackgroundImage(character);
            }
            break;

        case 'right':
            if (y != CHARACTER_HEIGHT) {
                character.style.backgroundPositionY = CHARACTER_HEIGHT + 'px';
                character.style.backgroundPositionX = '0px';
            } else {
                moveBackgroundImage(character);
            }
            break;
    }
}

function moveBackgroundImage(character) {
    let x = parseInt(character.style.backgroundPositionX);

    if (x == 9 * CHARACTER_WIDTH) {
        character.style.backgroundPositionX = '0px'
    } else {
        character.style.backgroundPositionX = (x + CHARACTER_WIDTH) + 'px';
    }
}

/*function animateCharacters() {
    let keyPressed = false;

    for (let key of pressedKeys) {
        if (key) {
            key = true;
        }
    }

    if (keyPressed) {
        let imageName = player.src.split('/')[3];
        let imageDirection = imageName.substring(0, imageName.lenght - 5);
        let imageNumber = parseInt(imageName.substring(imageName.lenght - 1, imageName.lenght));

        if (imageDirection == player.direction) {
            if (imageNumber != 8) {
                player.src = './img/player/' + imageDirection + (imageNumber + 1) + '.png';
            } else {
                player.src = './img/player/' + imageDirection + '0.png';
            }
        } else {
            player.src = '.img/player/' + player.direction + '0.png';
        }
    } else {
        player.src = '.img/player/' + player.direction + '0.png';
    }
}*/