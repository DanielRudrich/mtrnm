import { Pattern, Position, BarType } from "../common/types";

function shouldPlaySound(barType: BarType, beat: number): boolean {
  if (barType === "full") {
    return true;
  }

  if (barType === "backbeat") {
    return beat % 2 === 1;
  }

  return false;
}

class TickSound {
  private index: number = Infinity;
  private interval: number;

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
  private _bpm: number = 120;
  private _playing: boolean = false;

  private elapsedTimeSinceLastTick: number = 0;
  private interval: number = 0;

  private tickSound: TickSound;

  private position: Position = {
    bar: 0,
    beat: -1,
  };

  private _pattern: Pattern = ["full", "backbeat"];

  get pattern() {
    return this._pattern;
  }

  set pattern(value: Pattern) {
    this._pattern = value;
  }

  constructor(
    private sampleRate: number,
    private onTick: (position: Position) => void,
  ) {
    this.tickSound = new TickSound(sampleRate);
    this.bpm = this._bpm;
    this.elapsedTimeSinceLastTick = this.interval;
    this.broadcastPosition();
  }

  private broadcastPosition() {
    this.onTick(this.position);
  }

  set bpm(value: number) {
    this._bpm = value;
    this.interval = 60 / this._bpm;
  }

  get bpm() {
    return this._bpm;
  }

  set playing(value: number) {
    const shouldBePlaying = !!value;
    if (this._playing === shouldBePlaying) {
      return;
    }

    this._playing = shouldBePlaying;

    if (shouldBePlaying) {
      this.elapsedTimeSinceLastTick = this.interval;
      this.position = {
        bar: 0,
        beat: -1,
      };
    } else {
      this.position = {
        bar: 0,
        beat: -1,
      };

      this.broadcastPosition();
    }
  }

  process(data: Float32Array) {
    if (!this._playing) {
      return;
    }

    const numSamples = data.length;

    const timePerSample = 1 / this.sampleRate;

    for (let i = 0; i < numSamples; ++i) {
      this.elapsedTimeSinceLastTick += timePerSample;
      if (this.elapsedTimeSinceLastTick > this.interval) {
        this.elapsedTimeSinceLastTick -= this.interval;

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
      this.position = {
        bar: 0,
        beat: -1,
      };
      this.broadcastPosition();
      return false;
    }

    const BEATS_PER_BAR = 4;

    this.position.beat++;
    if (this.position.beat >= BEATS_PER_BAR) {
      this.position.beat = 0;
      this.position.bar++;
      this.position.bar %= numBars;
    }

    this.broadcastPosition();

    return shouldPlaySound(this.pattern[this.position.bar], this.position.beat);
  }
}

// @ts-ignore
class MetronomeProcessor extends AudioWorkletProcessor {
  metronome = new Metronome(sampleRate, (position) => {
    this.port.postMessage(position);
  });

  constructor(options: AudioWorkletNodeOptions) {
    super();

    this.metronome.pattern = options.processorOptions.pattern;

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
        maxValue: 300,
        automationRate: "k-rate",
      },
      {
        name: "playing",
        defaultValue: 1,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
    ];
  }

  public process(
    inputList: Float32Array[][],
    outputList: Float32Array[][],
    parameters: Record<string, Float32Array>,
  ) {
    const output = outputList[0];

    this.metronome.bpm = parameters.bpm[0];
    this.metronome.playing = parameters.playing[0];
    this.metronome.process(output[0]);

    return true;
  }
}

// @ts-ignore Register the AudioWorklet processor
registerProcessor("metronome", MetronomeProcessor);
