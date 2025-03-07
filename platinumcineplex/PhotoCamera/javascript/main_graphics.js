function draw() {
    background('#5C16C1');
    scene.minWin = min(width, height);
    scene.runtime = millis() / 1000;


    scene.panel.target = { x: 0, y: 0, w: width, h: height };

    scene.logo.target = {
        x: width / 2,
        y: height / 2 - scene.minWin / 6,
        s: scene.minWin / 2,
    };

    scene.bar.target = {
        x: width / 2,
        y: height / 1.5,
        w: width / 2,
        h: width / 32
    };

    scene.start.target.opacity = 0;
    scene.title.target = { x: width / 0.5, y: scene.logo.target.y, opacity: 0 };

    let label = 'Mulai Foto';

    if (!file.loading) {
        scene.logo.target.s = scene.minWin / 4;
        scene.logo.target.x = scene.logo.target.s / 2;
        scene.logo.target.y = scene.logo.target.s / 2;
        scene.title.target.x = width - scene.logo.target.s / 1.25;
        scene.title.target.y = scene.logo.target.y;
        scene.title.target.opacity = 255;
        scene.bar.target.y = height / 2;
        scene.bar.target.h = width / 8;
        scene.start.target.opacity = 255;
    }

    if (inout.webcam.prepared) {
        scene.start.target.opacity = 0;
        scene.bar.target.y = height / 1.25;
        scene.bar.target.h = scene.minWin * 0.2;
        scene.bar.target.w = scene.bar.target.h;
        scene.panel.target.y = height;
        if (inout.webcam.captured) {
            scene.bar.target.y = height / 1.5;
            scene.bar.target.h = width / 16;
            scene.bar.target.w = width / 4;
            if (abs(scene.bar.current.w - scene.bar.target.w) / scene.bar.target.w < 0.0625) scene.start.target.opacity = 255;
        }
    }

    scene.panel.current = {
        x: lerp(scene.panel.current.x, scene.panel.target.x, 0.125),
        y: lerp(scene.panel.current.y, scene.panel.target.y, 0.125),
        w: lerp(scene.panel.current.w, scene.panel.target.w, 0.125),
        h: lerp(scene.panel.current.h, scene.panel.target.h, 0.125)
    };

    scene.logo.current = {
        x: lerp(scene.logo.current.x, scene.logo.target.x, 0.125),
        y: lerp(scene.logo.current.y, scene.logo.target.y, 0.125),
        s: lerp(scene.logo.current.s, scene.logo.target.s, 0.125)
    };

    scene.title.current = {
        x: lerp(scene.title.current.x, scene.title.target.x, 0.0625),
        y: lerp(scene.title.current.y, scene.title.target.y, 0.5),
        opacity: lerp(scene.title.current.opacity, scene.title.target.opacity, 0.125)
    };

    scene.bar.current = {
        x: lerp(scene.bar.current.x, scene.bar.target.x, 0.125),
        y: lerp(scene.bar.current.y, scene.bar.target.y, 0.0625),
        w: lerp(scene.bar.current.w, scene.bar.target.w, 0.125),
        h: lerp(scene.bar.current.h, scene.bar.target.h, 0.125)
    };

    scene.start.current.opacity = lerp(
        scene.start.current.opacity,
        scene.start.target.opacity,
        0.5
    );

    //--------------------//

    inout.webcam.render(this);

    push();
    noStroke();
    fill('#5C16C1');
    rect(
        scene.panel.current.x,
        scene.panel.current.y,
        scene.panel.current.w,
        scene.panel.current.h
    );

    imageMode(CENTER);
    if (file.content.splash.logo) image(file.content.splash.logo,
        scene.logo.current.x, scene.logo.current.y,
        scene.logo.current.s, scene.logo.current.s,
        0, 0,
        file.content.splash.logo.width, file.content.splash.logo.height,
        CONTAIN
    );

    tint(255, scene.title.current.opacity);
    image(
        file.content.splash.title,
        scene.title.current.x, scene.title.current.y,
        scene.logo.current.s / 0.8, scene.logo.current.s,
        0, 0,
        file.content.splash.title.width, file.content.splash.title.height,
        CONTAIN
    );
    pop();

    file.tracker.update(
        file.counter,
        null,
        !inout.webcam.prepared
            ? fract(scene.runtime)
            : (scene.tap ? 1 : 0.5)
    );
    file.tracker.display.bar(
        scene.bar.current.x, scene.bar.current.y,
        scene.bar.current.w, scene.bar.current.h
    );

    push();
    textFont(file.content.font.Figtree.Bold, scene.bar.current.h / 2);
    noStroke();

    if (!inout.webcam.newstart) label = 'Foto Ulang';
    if (inout.webcam.prepared && !inout.webcam.button.timer.end()) {
        label = floor(inout.webcam.button.timer.counterDown + 0.5);
        scene.start.target.opacity = 255;
    }

    textAlign(CENTER, CENTER);
    fill(255, scene.start.current.opacity);
    text(label, scene.bar.current.x, scene.bar.current.y);
    pop();

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    inout.webcam.resize(width, height);

    scene.graphic.resizeCanvas(width, height);
}
