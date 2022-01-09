async function loadSprite(name) {
    const url = `sprites/${name}.sprite`;
    let response = '';
    await fetch(url)
        .then(r => r.text())
        .then(t => response = t);
    let sprite = JSON.parse(response);
    sprite.negation = (frametoNeg = -1) => {
        if (frametoNeg == -1) {
            sprite.frames.forEach(frame => {

                for (let i = 0; i < frame.length; ++i) {
                    if (frame[i] == 1) frame[i] = 0;
                    else if (frame[i] == 0) frame[i] = 1;
                }

            });
        } else {
            sprite.frames[frametoNeg].forEach(pixel => {
                if (pixel == 1) pixel = 0;
                else if (pixel == 0) pixel = 1;
            });
        }
    }
    sprite.isXFlipped = false;
    sprite.isYFlipped = false;
    sprite.flip = (flipX = true, flipY = false) => {
        flipSprite(sprite, flipX, flipY);
    }
    sprites[name] = sprite;
}

function drawSprite(x, y, sprite, frame = 0) {
    if (typeof (sprite) === 'undefined') {
        console.error('sprite is empty');
        return;
    }
    for (let i = 0; i < sprite.width; ++i) {
        for (let j = 0; j < sprite.height; ++j) {
            const color = sprite.frames[frame][i % sprite.width + sprite.width * (j % sprite.height)];
            if (color == 2) continue;
            setPixel(x + i, y + j, color);
        }
    }
}

function drawCircle(x, y, radius, color, fill = true) {
    for (let x1 = x - radius; x1 < x + radius; ++x1) {
        for (let y1 = y - radius; y1 < y + radius; ++y1) {
            if (Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y)) < radius) {
                if (fill || Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y)) > radius - 1.00001) {
                    setPixel(x1, y1, color);
                }

            }
        }
    }
}

function drawRectangle(x, y, width, height, color, fill = true) {
    for (let x1 = x; x1 < x + width; ++x1) {
        for (let y1 = y; y1 < y + height; ++y1) {
            if (fill || (x1 == x || x1 == x + width - 1 || y1 == y || y1 == y + height - 1)) {
                setPixel(x1, y1, color);
            }
        }
    }
}

function drawLine(x1, y1, x2, y2, color = 1, dashedEvery = 1) {
    if (dashedEvery < 1) dashedEvery = 1;
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = (x1 < x2) ? 1 : -1;
    const sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;
    let index = 0;
    while (true) {

        setPixel(x1, y1, index++ % dashedEvery == 0 ? color : !color);
        if (x1 === x2 && y1 === y2) {
            break;
        }
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y1 += sy;
        }
    }


}

function rotateSprite(sprite, angle, frame = 0) {
    let newSprite = {};
    newSprite.width = sprite.width;
    newSprite.height = sprite.height;
    newSprite.frames = [];
    for (let i = 0; i < sprite.frames[frame].length; ++i) {
        newSprite.frames[i] = sprite.frames[frame][i];
    }
    for (let i = 0; i < sprite.height; ++i) {
        for (let j = 0; j < sprite.width; ++j) {

            let x = j - sprite.width / 2;
            let y = i - sprite.height / 2;
            let x2 = x * Math.cos(angle) - y * Math.sin(angle);
            let y2 = x * Math.sin(angle) + y * Math.cos(angle);
            x = x2 + sprite.width / 2;
            y = y2 + sprite.height / 2;
            if (x < 0 || x >= sprite.width || y < 0 || y >= sprite.height) {
                continue;
            }
            newSprite.frames[Math.floor(x) + newSprite.width * Math.floor(y)] = sprite.frames[0][j + sprite.width * i];
        }
    }

    sprite = newSprite;
    sprites.test3 = newSprite;
    return newSprite;
}

function flipSprite(sprite, flipX = false, flipY = false) {
    if (typeof (sprite) === 'undefined') {
        console.error('sprite is empty');
        return;
    }

    if (flipY == true && flipX == true) {
        flipSprite(sprite, true);
        flipX = false;
    }

    sprite.isXFlipped = flipX ? !sprite.isXFlipped : sprite.isXFlipped;
    sprite.isYFlipped = flipY ? !sprite.isYFlipped : sprite.isYFlipped;

    for (let x = 0; x < sprite.width / (1 + (flipX + 0)); ++x) {
        for (let y = 0; y < sprite.height / (1 + (flipY + 0)); ++y) {
            if (flipX) {
                const buf = sprite.frames[0][x + sprite.width * y];
                sprite.frames[0][x + sprite.width * y] = sprite.frames[0][(sprite.width - x - 1) + sprite.width * y];
                sprite.frames[0][(sprite.width - x - 1) + sprite.width * y] = buf;
            } else
            if (flipY) {
                const buf = sprite.frames[0][x + sprite.width * y];
                sprite.frames[0][x + sprite.width * y] = sprite.frames[0][x + sprite.width * (sprite.height - y - 1)];
                sprite.frames[0][x + sprite.width * (sprite.height - y - 1)] = buf;
            }
        }
    }
}



function progressBar(x, y, width, height, progressColor = 1, borderSize = 1) {
    let progress = {};
    progress.x = x;
    progress.y = y + 1;
    progress.width = width;
    progress.height = height;
    progress.maxValue = 100;
    progress.value = 0;
    progress.progressColor = progressColor;
    progress.borderSize = borderSize;
    progress.update = function (value = progress.value, maxValue = progress.maxValue) {
        progress.value = value;
        progress.maxValue = maxValue;
        for (let x = 0; x < progress.width; ++x) {
            for (let y = 0; y < progress.height; ++y) {
                setPixel(x + progress.x, y + progress.y, (value / progress.maxValue) > (x / progress.width) == progressColor ? 1 : 0);
            }
        }
        for (let x = 0; x < progress.width; ++x) {
            setPixel(x + progress.x, progress.y - 1, !progress.progressColor);
            setPixel(x + progress.x, progress.y + progress.height, !progress.progressColor);
        }
        for (let y = 0; y < progress.height; ++y) {
            setPixel(progress.x - 1, y + progress.y, !progress.progressColor);
            setPixel(progress.x + progress.width, y + progress.y, !progress.progressColor);
        }
    }
    progress.update();
    return progress;
}


function mask(xOffset, yOffset, sprite, maskColor = 0) {
    if (typeof (sprite) === 'undefined') {
        console.error('sprite is empty');
        return;
    }

    for (let x = 0; x < resolution.width; ++x) {
        for (let y = 0; y < resolution.height; ++y) {

            let b = true;
            for (let _x = 0; b && _x < sprite.width; ++_x) {
                for (let _y = 0; b && _y < sprite.height; ++_y) {

                    if (x == xOffset + _x && y == yOffset + _y) {
                        setPixel(x, y, sprite.frames[0][_x + sprite.width * _y]);
                        b = false;
                    } else {
                        setPixel(x, y, maskColor);
                    }
                }
            }
        }
    }


}