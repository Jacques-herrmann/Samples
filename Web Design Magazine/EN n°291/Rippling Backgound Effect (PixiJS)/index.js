import * as PIXI from "pixi.js"

//Create the View
let ds = document.getElementById("distort");
const app = new PIXI.Application({
    width: 1600,
    height:1067,
    backgroundColor: 0xffffff,
    resolution: window.devicePixelRatio || 1
});
ds.appendChild(app.view);

// Setting the stage
app.stage.interactive = true;

const container = new PIXI.Container();
app.stage.addChild(container);
let containerSize = {
    x: window.innerWidth,
    y: window.innerHeight
};

// Load the image
const bg = new PIXI.Sprite.from('img/bg.jpg');
container.addChild(bg);
bg.x = -10;
bg.y = -10;
bg.scale.set(1.1, 1.1);

// Create the displacement map
const displacementSprite = PIXI.Sprite.from('img/map.jpg');
displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
displacementFilter.padding = 10;

// Apply the displacement
displacementSprite.position = bg.position;
displacementSprite.scale.set(3, 3);
app.stage.addChild(displacementSprite);
bg.filters = [displacementFilter];
displacementFilter.scale.x = 120;
displacementFilter.scale.y = 120;

// Update and Animate
app.ticker.add(() => {
    displacementSprite.y += 1;
    if (displacementSprite.y > displacementSprite.height) {
        displacementSprite.y = 0;
    }
});