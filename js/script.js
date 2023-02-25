const app = new PIXI.Application({ background: '#1099bb' });
document.body.appendChild(app.view);

let first, animatedCapguy, bullet, pixel, containerBala, speed;

const capguyFrames = [
    "./img/sprite/capguy/walk_01.png",
    "./img/sprite/capguy/walk_02.png",
    "./img/sprite/capguy/walk_03.png",
    "./img/sprite/capguy/walk_04.png",
    "./img/sprite/capguy/walk_05.png",
    "./img/sprite/capguy/walk_06.png",
    "./img/sprite/capguy/walk_07.png",
    "./img/sprite/capguy/walk_08.png",
    "./img/sprite/capguy/walk_09.png",
    "./img/sprite/capguy/walk_10.png",
    "./img/sprite/capguy/walk_11.png"
];

app.loader
    .add(capguyFrames)
    .load(setup);

app.renderer.resize(window.innerWidth, window.innerHeight);

const containerMenu = new PIXI.Container();
app.stage.addChild(containerMenu);


function setup() {
    createText("Começar", '#ffffff', (app.screen.width / 2), (app.screen.height / 2), true, containerMenu);
}

function soundEffect(caminho, vol) {
    const soundCard = PIXI.sound.Sound.from(caminho);
    soundCard.volume = vol;
    soundCard.play();
}

function gameLoop(delta) {
    animatedCapguy.x = (animatedCapguy.x + 5 * delta) % (200);
}

function createText(valor, cor, alignX, alignY, interativo, container, reload) {
    const basicText = new PIXI.Text(valor, {
        fill: cor
    });
    basicText.anchor.set(.5);
    basicText.x = alignX;
    basicText.y = alignY;
    if (interativo === true) {
        basicText.interactive = true;
        basicText.cursor = 'pointer';
        basicText.on('pointerdown', () => {
            if (reload === true) {
                window.location.reload();
            }
            else {
                soundEffect('./sound/click.wav', .1);
                container.destroy();
                startGame();
            }
        })
    }
    container.addChild(basicText);
}

function createGraphic(color, localX, localY, largura, altura, interativo) {
    const containerGraphics = new PIXI.Container();
    app.stage.addChild(containerGraphics);

    const graphics = new PIXI.Graphics();
    graphics.beginFill(color);
    graphics.drawRect(localX, localY, largura, altura);
    graphics.endFill();
    if (interativo === true) {
        graphics.interactive = true;
        graphics.on('pointerdown', () => {
            createText("Fim de jogo", '#ffffff', (app.screen.width / 2), (app.screen.height / 2), true, containerBala, true);
            clearInterval(gerandoBalas);
        })
    }
    containerGraphics.addChild(graphics);
}

function createSprite(localX, localY, largura, altura, interativo) {
    const containerGraphics = new PIXI.Container();
    app.stage.addChild(containerGraphics);

    const graphics = new PIXI.Sprite.from("./img/house.png");
    graphics.x = localX;
    graphics.y = localY;
    graphics.width = largura;
    graphics.height = altura;
    if (interativo === true) {
        graphics.interactive = true;
        graphics.on('pointerdown', () => {
            createText("Fim de jogo", '#ffffff', (app.screen.width / 2), (app.screen.height / 2), true, containerBala, true);
            clearInterval(gerandoBalas);
        })
    }
    containerGraphics.addChild(graphics);
}


function animationExplosion(x, y) {
    const containerAnimation = new PIXI.Container();
    app.stage.addChild(containerAnimation);

    animatedCapguy = new PIXI.AnimatedSprite.fromFrames(capguyFrames);
    animatedCapguy.width = 50;
    animatedCapguy.height = 50;
    animatedCapguy.animationSpeed = 1 / 2.5;
    animatedCapguy.anchor.set(.5);
    animatedCapguy.position.set(x, y);
    animatedCapguy.loop = false;
    animatedCapguy.play();
    soundEffect('./sound/explosion1.ogg', .1);
    containerAnimation.addChild(animatedCapguy);
    setTimeout(() => {
        containerAnimation.destroy();
    }, 500)
}


function startGame() {
    const containerGame = new PIXI.Container();
    app.stage.addChild(containerGame);

    createGraphic(0x005200, 0, (app.screen.height - 100), app.screen.width, 100, false);
    createSprite((app.screen.width / 2 - 50), (app.screen.height - 175), 100, 100, true);

    function bulletGenerator() {
        containerBala = new PIXI.Container();
        app.stage.addChild(containerBala);

        bullet = new PIXI.Graphics();
        bullet.beginFill(0xffffff);
        bullet.drawRect(0, 0, 5, 5);
        bullet.x = (app.screen.width / 2) + Math.random() * (45 - (-50)) + (-50);
        bullet.endFill();
        console.log(bullet.x);
        containerBala.addChild(bullet);
        if (bullet.y !== (app.screen.height - 155)) {
            const descendoBala = setInterval(() => {
                if (pixel === false) {
                    console.log("%c Pixel destruído! ", 'background: red;');
                    clearInterval(descendoBala);
                }
                if (bullet.y >= app.screen.height - 155) {
                    console.log("Morreu");
                    createText("Fim de jogo", '#ffffff', (app.screen.width / 2), (app.screen.height / 2), true, containerBala, true);
                    clearInterval(gerandoBalas);
                    clearInterval(descendoBala);
                }
                else {
                    bullet.y = bullet.y + 10;
                }
            }, 30)
        }
    }

    bulletGenerator();
    const gerandoBalas = setInterval(() => {
        pixel = true;
        bulletGenerator();
    }, 2000)

    const protagonista = PIXI.Sprite.from('./img/target.png');
    protagonista.anchor.set(0.5);
    protagonista.width = 30;
    protagonista.height = 30;
    protagonista.x = app.screen.width / 2;
    protagonista.y = app.screen.height / 2;
    app.stage.addChild(protagonista);

    containerGame.interactive = true;
    containerGame.on("pointermove", movePlayer);
    document.body.style.cursor = "none";

    function movePlayer(e) {
        let pos = e.data.global;
        protagonista.x = pos.x;
        protagonista.y = pos.y;
    }

    onpointerdown = (event) => {
        if (first === true) {
            animationExplosion(protagonista.x, protagonista.y);
            console.log('x: ' + protagonista.x + ' ' + 'y: ' + protagonista.y);
            if (
                protagonista.x <= bullet.x + 20 &&
                protagonista.x >= bullet.x - 20
            ) {
                if (
                    protagonista.y <= bullet.y + 20 &&
                    protagonista.y >= bullet.y - 20
                ) {
                    console.log("Acertou");
                    containerBala.destroy();
                    pixel = false;
                }
            }
        }
        first = true;
    }
}