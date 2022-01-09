function bindInput(key, index, name) {
    if (index > 12 || index < 0) {
        console.error('bindInput index out of bounds. Valid range is 0-12. Was: ' + index);
        return;
    }
    if (typeof (key) === 'string') {
        key = key.toUpperCase().charCodeAt(0);
    }
    bindings[name] = {
        key: key,
        index: index
    };
}

function getInput(name) {
    if (bindings[name]) {
        return inputs[bindings[name].index];
    }
    console.warn('not binded input! ' + name);
    return false;
}

document.onkeydown = (e) => {
    for (let i = 0; i < Object.keys(bindings).length; ++i) {
        if (e.keyCode === bindings[Object.keys(bindings)[i]].key) {
            inputs[bindings[Object.keys(bindings)[i]].index] = true;
            return;
        }
    }
}

document.onkeyup = (e) => {
    for (let i = 0; i < Object.keys(bindings).length; ++i) {
        if (e.keyCode === bindings[Object.keys(bindings)[i]].key) {
            inputs[bindings[Object.keys(bindings)[i]].index] = false;
            return;
        }
    }
}

function getMousePositions(e) {
    const rect = app.view.getBoundingClientRect();
    let x = Math.floor((e.clientX - rect.left) / (rect.right - rect.left) * resolution.width);
    let y = Math.floor((e.clientY - rect.top) / (rect.bottom - rect.top) * resolution.height);

    if (x < 0 || x >= resolution.width || y < 0 || y >= resolution.height) {
        return false;
    }

    return {
        x: x,
        y: y,
        color: getPixel(x, y)
    };
}

document.addEventListener('mousemove', (e) => {
    mouseOnPixel = getMousePositions(e);
});