const colors = [0x43523d, 0xc7f0d8];
const resolution = { width: 84, height: 48 };
const pixelSize = { width: 10, height: 10 };
let worldOffset = { x: 0, y: 0 };
let inputs = new Array(12).fill(false);
let mouseOnPixel = false;
let bindings = {};
let touchControls = {}; //for mobile
let pixels = [];
let levels = {};
let sprites = {};
let loadedFonts = {};
let playedMusic = false;

const app = new PIXI.Application({
    width: pixelSize.width * resolution.width, height: pixelSize.height * resolution.height, backgroundColor: 0x43523d, resolution: window.devicePixelRatio || 1,
});


for (let x = 0; x < resolution.width; ++x) {
    pixels.push([]);
    for (let y = 0; y < resolution.height; ++y) {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(colors[1]);
        graphics.drawRect(x * pixelSize.width, y * pixelSize.height, pixelSize.width, pixelSize.height);
        graphics.endFill();
        app.stage.addChild(graphics);
        pixels[x].push(graphics);
    }
}

document.body.appendChild(app.view);

window.onload = () => {
    setTimeout(() => {
        start();
        app.ticker.add((delta) => {
            update(delta);
        });
    }, 1000)

}