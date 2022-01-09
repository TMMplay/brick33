async function loadFont(name) {
    const url = `fonts/${name}.spriteFont`;
    let response = '';
    await fetch(url)
        .then(r => r.text())
        .then(t => response = t);
    let font = JSON.parse(response.replace('%23', '#'));
    loadedFonts[name] = font;
}

function printText(x, y, text, font, color = 0, forcebackground = false) {
    if (!loadedFonts[font]) {
        console.error('font not loaded');
        return false;
    }
    let nextXPosOffset = 0;

    for (let i = 0; i < text.length; ++i) {
        const char = text[i];
        for (let j = 0; j < loadedFonts[font].length; ++j) {
            if (loadedFonts[font][j].char == char) {
                for (let k = 0; k < loadedFonts[font][j].height && forcebackground; ++k) {
                    setPixel(x - 1, y + k, !color);
                }
                for (let xOffset = 0; xOffset < loadedFonts[font][j].width; ++xOffset) {
                    for (let yOffset = 0; yOffset < loadedFonts[font][j].height; ++yOffset) {
                        let pixel = loadedFonts[font][j].sprite[xOffset % loadedFonts[font][j].width + loadedFonts[font][j].width * (yOffset % loadedFonts[font][j].height)];
                        if (pixel == 1) {
                            setPixel(x + xOffset + nextXPosOffset, y + yOffset, color);
                        } else if (forcebackground) {
                            setPixel(x + xOffset + nextXPosOffset, y + yOffset, !color);
                        }
                    }

                }
                nextXPosOffset += loadedFonts[font][j].width;
                for (let k = 0; k < loadedFonts[font][j].height && forcebackground; ++k) {
                    setPixel(x + nextXPosOffset, y + k, !color);
                }
                ++nextXPosOffset;

                break;
            }
        }
    }
    if (forcebackground)
        drawLine(x - 1, y - 1, x + nextXPosOffset - 1, y - 1, !color);
    return nextXPosOffset;
}