class Webcam {
    #newstart;

    constructor(custom = false, number = 1, label = '', settings = null) {
        this.device = {
            number: number,
            id: '',
            label: label
        };
        this.custom = custom;
        this.stream = null;
        this.canvas = null;
        this.button = {
            timer: new Timer(3),
            press: this.#press.bind(this),
        };
        this.settings = settings ||
        {
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                resizeMode: 'crop-and-scale',
                framerate: {
                    ideal: 30,
                    min: 15,
                    max: 60
                }
            },
            audio: false
        };
        this.prepared = false;
        this.captured = false;
        this.#newstart = true;

        this.#presetup();
    }

    async #presetup() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cameraModule = devices.filter(device => device.kind === 'videoinput');

            if (cameraModule.length > 0) {
                let preferredCamera = cameraModule.find(device => device.label.includes(this.device.label));
                let videoCamera = preferredCamera ?? (cameraModule[this.device.number] || cameraModule[0]);

                this.device.id = videoCamera.deviceId;
                console.log('Selected camera:', this.device.label || 'Not specified');
                this.device.label = videoCamera.label;
                console.log('Detected camera:', this.device.label, 'ID:', this.device.id);
            } else {
                throw new Error('No camera modules found');
            }
        } catch (error) {
            console.error('Camera access error:', error);
        }
    }

    initiate() {
        if (this.stream) {
            this.stream.remove();
            this.prepared = false;
        }

        this.settings.video.deviceId = this.device.id;

        this.stream = createCapture(this.custom ? this.settings : VIDEO, { flipped: true }, () => {
            this.canvas = createGraphics(width, height);
            this.stream.hide();
            this.prepared = true;
            console.log('Webcam initiated', this.settings);
        });
    }

    render(target_canvas) {
        if (!this.prepared) return;

        const minWin = min(width, height);

        this.canvas.background(0);
        this.canvas.image(this.stream,
            0, 0,
            width, height,
            0, 0,
            this.stream.width, this.stream.height,
            COVER
        );

        this.button.timer.time = millis() / 1000;

        // webcam live stream
        target_canvas.push();
        target_canvas.imageMode(CORNER);
        target_canvas.image(this.stream, 0, 0, width, height, 0, 0, this.stream.width, this.stream.height, COVER);
        target_canvas.pop()

        // webcam graphical user interface 
        const { position: pos, radius: rad, tapped: tap } = this.button;

        let pulse = sin(millis() / 1000 * PI) * 8,
            opacity = 55;
        if (tap) opacity = 125;

        target_canvas.noStroke();
        target_canvas.fill(255, opacity);
        target_canvas.textAlign(CENTER, CENTER);
        target_canvas.textFont(file.content.font.Figtree.Bold);

        if (this.button.timer.end()) {

            if (!this.captured) {
                if (!this.#newstart) {
                    this.stream.stop();
                    this.captured = true;
                    console.log('Webcam captured:', this.captured);
                }
            } else {
            }

        } else {
            pulse = cos(this.button.timer.counterDown * TAU) * 16;
            fill(255);
            textSize(minWin * 0.25 + pulse);
            text(floor(this.button.timer.counterDown + 0.5), width * 0.5, height * 0.5);
        }

    }

    resize(w, h) {
        if (this.prepared) this.canvas.resizeCanvas(w, h);
    }

    #press() {
        if (this.#newstart) this.#newstart = false;
        if (this.captured) {
            this.stream.play();
            this.captured = false;
        }
        this.button.timer.start();
    }
}