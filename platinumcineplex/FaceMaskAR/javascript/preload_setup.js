function preload() {
    file.content = { logo: loadImage('resource/logo.png') };
}

function setup() {

    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    smooth();

    inout.webcam = new Webcam()
    mapper = new Mapper();

    scene.minWin = min(width, height);

    scene.tap = false;

    scene.panel = {
        target: {
            x: 0,
            y: 0,
            w: width,
            h: height
        },
        current: {}
    };
    scene.panel.current = { ...scene.panel.target };

    scene.logo = {
        target: {
            x: width / 2,
            y: height / 2 - scene.minWin / 6,
            s: scene.minWin / 2,
        },
        current: {}
    };
    scene.logo.current = { ...scene.logo.target };

    scene.bar = {
        target: {
            w: width / 2,
            h: width / 32,
            x: width / 2,
            y: height / 1.5
        },
        current: {}
    };
    scene.bar.current = { ...scene.bar.target };

    scene.start = {
        target: { opacity: 0 },
        current: {}
    };
    scene.start.current = { ...scene.start.target };

    scene.title = {
        target: {
            x: width / 0.5,
            y: scene.logo.target.y,
            opacity: 0
        },
        current: {}
    }
    scene.title.current = { ...scene.title.target };

    console.log('Loading resources...');

    const logo = file.content.logo;
    file = new Loader(file.catalog);
    file.content.logo = logo;
    file.tracker = new ProgressStat(file.overall);

    textFont(file.content.font.Figtree.Regular, min(width, height) / 16);

    scene.graphic = createGraphics(width, height, WEBGL);

}