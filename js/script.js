const V_BULLET = 15;
const V_PLAYER = 10;
const V_ENEMY = 3;
const MIN_X = 100;
const MIN_Y = 100;
const MAX_X = window.innerWidth - 100;
const MAX_Y = window.innerHeight - 100;
const VALID_KEYS = ['w', 'a', 's', 'd', 'W', 'A', 'S', 'D', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
let CHARACTER_WIDTH = 30;
let CHARACTER_HEIGHT = 53;
let player;
let body;
let game;
let pressedKeys;
let bulletIntervals;
let mainInterval;
let spawnEnemyInterval;
let reloaded;
let bulletCounter;
let bulletDirection;
let score;
let highscore = 0;
let scoreParagraph;
let highscoreParagraph;

window.addEventListener('load', () => {
    let div = document.createElement('div');
    let h1 = document.createElement('h1');
    let button = document.createElement('button');

    body = document.getElementById('body');

    h1.textContent = 'Game';
    button.textContent = 'Play';

    button.addEventListener('click', () => {
        init();
        body.removeChild(div);
    });

    div.appendChild(h1);
    div.appendChild(button);

    body.appendChild(div);
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

function init() {
    pressedKeys = [];
    bulletIntervals = [];
    reloaded = true;
    bulletCounter = 0;
    score = 0;

    scoreParagraph = document.createElement('p');
    highscoreParagraph = document.createElement('p');

    scoreParagraph.textContent = 'Score: ' + score;
    highscoreParagraph.textContent = 'Highscore: ' + highscore;

    game = document.createElement('div');

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

    game.appendChild(player);
    game.appendChild(scoreParagraph);
    game.appendChild(highscoreParagraph);

    body.appendChild(game);

    mainInterval = setInterval(interval, 10);
    spawnEnemyInterval = setInterval(spawnEnemy, 5000);
}

function interval() {
    interpretKeys();
    moveBullets();
    moveEnemies();
}

function interpretKeys() {
    let noKeysPressed = true;

    for (let i in pressedKeys) {
        if (pressedKeys[i]) {
            noKeysPressed = false;
        }
    }

    if (pressedKeys['w'] || pressedKeys['W']) {
        player.direction = 'up';
        move(player);
        animate(player, false);
    }
    if (pressedKeys['a'] || pressedKeys['A']) {
        player.direction = 'left';
        move(player);
        animate(player, false);
    }
    if (pressedKeys['s'] || pressedKeys['S']) {
        player.direction = 'down';
        move(player);
        animate(player, false);
    }
    if (pressedKeys['d'] || pressedKeys['D']) {
        player.direction = 'right';
        move(player);
        animate(player, false);
    }
    if (pressedKeys['ArrowUp'] && reloaded) {
        bulletDirection = 'up';
        shoot(player);
    }
    if (pressedKeys['ArrowLeft'] && reloaded) {
        bulletDirection = 'left';
        shoot(player);
    }
    if (pressedKeys['ArrowDown'] && reloaded) {
        bulletDirection = 'down';
        shoot(player);
    }
    if (pressedKeys['ArrowRight'] && reloaded) {
        bulletDirection = 'right';
        shoot(player);
    }
    if (noKeysPressed) {
        animate(player, true);
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
}

function shoot() {
    let longSide = '20px';
    let shortSide = '6px';
    let bullet = document.createElement('div');

    reloaded = false;
    setTimeout(reload, 300);

    bullet.className = 'bullet';
    bullet.direction = bulletDirection;
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

    game.appendChild(bullet);
}

function moveBullets() {
    for (let bullet of document.getElementsByClassName('bullet')) {
        let top = parseInt(bullet.style.top);
        let left = parseInt(bullet.style.left);

        switch (bullet.direction) {
            case 'up':
                bullet.style.top = (top - V_BULLET) + 'px';
                break;

            case 'left':
                bullet.style.left = (left - V_BULLET) + 'px';
                break;

            case 'down':
                bullet.style.top = (top + V_BULLET) + 'px';
                break;

            case 'right':
                bullet.style.left = (left + V_BULLET) + 'px';
                break;
        }

        top = parseInt(bullet.style.top);
        left = parseInt(bullet.style.left);

        for (let enemy of document.getElementsByClassName('enemy')) {
            let enemyTop = parseInt(enemy.style.top);
            let enemyLeft = parseInt(enemy.style.left);

            let collision = left + parseInt(bullet.style.width) >= enemyLeft
                            && left <= enemyLeft + parseInt(enemy.style.width)
                            && top + parseInt(bullet.style.height) >= enemyTop
                            && top <= enemyTop + parseInt(enemy.style.height);

            if (collision) {
                score++;
                scoreParagraph.textContent = 'Score: ' + score;

                if (score > highscore) {
                    highscore++;
                    highscoreParagraph.textContent = 'Highscore: ' + highscore;
                }

                game.removeChild(enemy);
                game.removeChild(bullet);
            }
        }

        if (left < MIN_X || left > MAX_X || top < MIN_Y || top > MAX_Y) {
            clearInterval(bulletIntervals['bullet' + bullet.number]);
            bulletIntervals.splice('bullet' + bullet.numer);
            game.removeChild(bullet);
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

    do {
        let distanceY;
        let distanceX;

        top = parseInt(Math.random() * (MAX_Y - MIN_Y - CHARACTER_HEIGHT) + MIN_Y);
        left = parseInt(Math.random() * (MAX_X - MIN_X - CHARACTER_WIDTH) + MIN_X);

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

    game.appendChild(enemy);
}

function moveEnemies() {
    for (let enemy of document.getElementsByClassName('enemy')) {
        let distanceX = parseInt(player.style.left) - parseInt(enemy.style.left);
        let distanceY = parseInt(player.style.top) - parseInt(enemy.style.top);

        let gameIsOver = distanceX <= parseInt(enemy.style.width) && distanceX * -1 <= parseInt(player.style.width)
                        && distanceY <= parseInt(enemy.style.height) && distanceY * -1 <= parseInt(player.style.height);

        if (gameIsOver) {
            gameOver();
        } else if (distanceX > 0 && distanceY > 0) {
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

        if (Math.abs(Math.abs(distanceX) - Math.abs(distanceY)) <= 3) {
            if (distanceX > 0) {
                enemy.direction = 'right';
            } else {
                enemy.direction = 'left';
            }
        }

        animate(enemy, false);
    }
}

function animate(character, noKeysPressed) {
    let y = parseInt(character.style.backgroundPositionY);

    switch (character.direction) {
        case 'up':
            if (y != 0 || noKeysPressed) {
                character.style.backgroundPositionY = '0px';
                character.style.backgroundPositionX = '0px';
            } else {
                moveBackgroundImage(character);
            }
            break;

        case 'left':
            if (y != 3 * CHARACTER_HEIGHT || noKeysPressed) {
                character.style.backgroundPositionY = (3 * CHARACTER_HEIGHT) + 'px';
                character.style.backgroundPositionX = '0px';
            } else {
                moveBackgroundImage(character);
            }
            break;

        case 'down':
            if (y != 2 * CHARACTER_HEIGHT || noKeysPressed) {
                character.style.backgroundPositionY = (2 * CHARACTER_HEIGHT) + 'px';
                character.style.backgroundPositionX = '0px';
            } else {
                moveBackgroundImage(character);
            }
            break;

        case 'right':
            if (y != CHARACTER_HEIGHT || noKeysPressed) {
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

function gameOver() {
    let div = document.createElement('div');
    let h1 = document.createElement('h1');
    let button = document.createElement('button');
    let p1 = document.createElement('p');
    let p2 = document.createElement('p');

    clearInterval(mainInterval);
    clearInterval(spawnEnemyInterval);

    for (let interval of bulletIntervals) {
        clearInterval(interval);
    }

    body.removeChild(game);

    h1.textContent = 'Game over';
    button.textContent = 'Play again';
    p1.textContent = 'Score: ' + score;
    p2.textContent = 'Highscore: ' + highscore;

    button.addEventListener('click', () => {
        init();
        body.removeChild(div);
    });

    div.appendChild(h1);
    div.appendChild(button);
    div.appendChild(p1);
    div.appendChild(p2);

    body.appendChild(div);
}