function setPixel(x, y, color) {
    if (x < 0 || x >= resolution.width || y < 0 || y >= resolution.height) {
        return;
    }
    pixels[parseInt(x)][parseInt(y)].visible = color;
}

function getPixel(x, y) {
    return pixels[x][y].visible;
}

function clear(color = false) {
    for (let x = 0; x < resolution.width; ++x) {
        for (let y = 0; y < resolution.height; ++y) {
            setPixel(x, y, color);
        }
    }
}

function negation(x, y) {
    for (let x = 0; x < resolution.width; ++x) {
        for (let y = 0; y < resolution.height; ++y) {
            setPixel(x, y, !getPixel(x, y));
        }
    }
}