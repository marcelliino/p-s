function touchStarted() {

    let { x, y, w, h } = scene.bar.current;
    if (mouseX > x - w / 2 && mouseX < x + w / 2 && mouseY > y - h / 2 && mouseY < y + h / 2) {
        scene.tap = true;
    }
}

function touchEnded() {

    let { x, y, w, h } = scene.bar.current;
    if (mouseX > x - w / 2 && mouseX < x + w / 2 && mouseY > y - h / 2 && mouseY < y + h / 2) {
        if (scene.tap && !file.loading) {
            if (!inout.webcam.prepared) inout.webcam.initiate();
            else inout.webcam.button.press();
        }
    }
    scene.tap = false;
}
