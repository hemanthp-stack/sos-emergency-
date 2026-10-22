// Web Audio API Synthesizer for realistic ringtones, call tones, and optional emergency sirens
// Zero external mp3 dependencies needed, works purely in browser

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.activeNodes = [];
    this.isPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Realistic phone ringtone (standard dual-frequency ring cadence: 440Hz + 480Hz)
  startPhoneRing() {
    this.init();
    this.stop();
    this.isPlaying = true;

    const playCadence = () => {
      if (!this.isPlaying) return;

      const now = this.ctx.currentTime;
      // US/International standard ring cadence: 2s sound, 4s silence (we do 1.8s sound, 2.2s silence for urgency)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(440, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(480, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
      gain.gain.setValueAtTime(0.18, now + 1.6);
      gain.gain.linearRampToValueAtTime(0, now + 1.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.85);
      osc2.stop(now + 1.85);

      this.activeNodes.push(osc1, osc2, gain);

      this.ringTimer = setTimeout(() => {
        if (this.isPlaying) playCadence();
      }, 3500);
    };

    playCadence();
  }

  // Realistic loud siren for audible SOS mode (warbling police/alarm wail)
  startSiren() {
    this.init();
    this.stop();
    this.isPlaying = true;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    const now = this.ctx.currentTime;

    // Siren frequency sweeps between 600Hz and 1300Hz
    osc.frequency.setValueAtTime(700, now);
    
    // Low frequency oscillator to modulate pitch
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(1.5, now); // 1.5 Hz warble

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(350, now);

    lfo.connect(osc.frequency);
    gain.gain.setValueAtTime(0.25, now);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    lfo.start(now);
    osc.start(now);

    this.activeNodes.push(osc, lfo, gain, lfoGain);
  }

  // Subtle discreet click/confirmation (haptic acoustic cue)
  playDiscreetConfirm() {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Simulated fake caller voice audio (ambient murmur/voice simulation)
  startCallerMurmur() {
    this.init();
    this.stop();
    this.isPlaying = true;

    // Filtered noise with speech formant characteristics
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, filter, gain);
  }

  stop() {
    this.isPlaying = false;
    if (this.ringTimer) clearTimeout(this.ringTimer);
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
  }
}

export const audioEngine = new AudioEngine();
