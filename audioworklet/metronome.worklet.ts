enum Bar {
    FULL = "full",
    BACKBEAT = "backbeat",
    SILENCE = "silence",
}

type Pattern = Bar[];

type Position = {
    bar: number;
    beat: number;
};

function shouldPlaySound(barType: Bar, beat: number): boolean {
    if (barType === Bar.FULL) {
        return true;
    }

    if (barType === Bar.BACKBEAT) {
        return beat % 2 === 1;
    }

    return false;
}

class TickSound {
    private index: number = 0;
    private interval: number = 0;

    static FREQUENCY = 1000;

    constructor(private sampleRate: number) {
        this.interval = Math.floor(this.sampleRate / TickSound.FREQUENCY / 2);
    }

    reset() {
        this.index = 0;
    }

    getNextSample(): number {
        if (this.index >= this.interval) {
            return 0;
        }
        return Math.sin((Math.PI * 2 * this.index++) / this.interval);
    }
}

class Metronome {
    private _bpm = 120;

    private nextNoteTimeInSeconds: number = 0;
    private interval: number = 0;

    private tickSound: TickSound;

    private position: Position = {
        bar: 0,
        beat: 0,
    };

    private _pattern: Pattern = [Bar.FULL, Bar.BACKBEAT];

    get pattern() {
        return this._pattern;
    }

    set pattern(value: Pattern) {
        this._pattern = value;
    }

    onTick?: (position: Position) => void;

    constructor(private sampleRate: number) {
        this.tickSound = new TickSound(sampleRate);
        this.interval = 60 / this.bpm;
        this.nextNoteTimeInSeconds = this.interval;
    }

    set bpm(value: number) {
        this._bpm = value;
        this.interval = 60 / this._bpm;
    }

    get bpm() {
        return this._bpm;
    }

    process(data: Float32Array) {
        const numSamples = data.length;

        const timePerSample = 1 / this.sampleRate;

        for (let i = 0; i < numSamples; ++i) {
            this.nextNoteTimeInSeconds -= timePerSample;
            if (this.nextNoteTimeInSeconds < 0) {
                this.nextNoteTimeInSeconds += this.interval;

                if (this.tick()) {
                    this.tickSound.reset();
                }
            }

            data[i] = this.tickSound.getNextSample();
        }
    }

    private tick(): boolean {
        const numBars = this.pattern.length;
        if (numBars === 0) {
            this.position.bar = -1;
            if (this.onTick) this.onTick(this.position);
            return false;
        }

        const numBeats = 4;

        this.position.beat++;
        if (this.position.beat >= numBeats) {
            this.position.beat = 0;
            this.position.bar++;
            this.position.bar %= numBars;
        }

        if (this.onTick) this.onTick(this.position);

        return shouldPlaySound(this.pattern[this.position.bar], this.position.beat);
    }
}

class MetronomeProcessor extends AudioWorkletProcessor {
    metronome = new Metronome(sampleRate);

    constructor(options: AudioWorkletNodeOptions) {
        super();

        this.metronome.pattern = options.processorOptions.pattern;
        this.metronome.onTick = (position) => {
            this.port.postMessage(position);
        };

        this.port.onmessage = (event) => {
            this.metronome.pattern = event.data.pattern;
        };
    }

    static get parameterDescriptors() {
        return [
            {
                name: "bpm",
                defaultValue: 120,
                minValue: 30,
                maxValue: 240,
                automationRate: "k-rate",
            },
        ];
    }

    public process(
        inputList: Float32Array[][],
        outputList: Float32Array[][],
        parameters: Record<string, Float32Array>
    ) {
        const output = outputList[0];

        this.metronome.bpm = parameters.bpm[0];
        this.metronome.process(output[0]);

        return true;
    }
}

registerProcessor("metronome", MetronomeProcessor);
