/** Original procedural sound. No recordings or downloaded audio assets. */
export class AudioEngine {
  private context?: AudioContext;
  private master?: GainNode;
  private filter?: BiquadFilterNode;
  private roomTone?: OscillatorNode;
  private roomGain?: GainNode;
  private threat = 0;
  private volume = 0.65;
  private heartbeat?: ReturnType<typeof setInterval>;
  private pulse = 0;

  start() {
    if (this.context) { void this.context.resume(); return; }
    const ctx = this.context = new AudioContext();
    this.master = ctx.createGain();
    this.master.gain.value = this.volume * 0.4;
    this.master.connect(ctx.destination);
    this.filter = ctx.createBiquadFilter();
    this.filter.type = 'lowpass'; this.filter.frequency.value = 18000;
    this.filter.connect(this.master);
    // A short decaying noise impulse supplies subtle, synthesized room reverb.
    const convolver = ctx.createConvolver();
    const impulse = ctx.createBuffer(2, ctx.sampleRate * 1.5, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 4);
    }
    convolver.buffer = impulse;
    const wet = ctx.createGain(); wet.gain.value = 0.12;
    this.filter.connect(convolver); convolver.connect(wet); wet.connect(this.master);
    this.roomTone = ctx.createOscillator(); this.roomTone.type = 'sine'; this.roomTone.frequency.value = 47;
    this.roomGain = ctx.createGain(); this.roomGain.gain.value = 0.045;
    this.roomTone.connect(this.roomGain); this.roomGain.connect(this.filter); this.roomTone.start();
    this.heartbeat = setInterval(() => {
      if (!this.context || this.threat < 0.1) return;
      this.pulse++;
      this.tone(52, 0.16, this.threat * 0.23, 'sine');
      this.tone(43, 0.12, this.threat * 0.15, 'sine', 0.16);
    }, 850);
  }
  setVolume(value: number) { this.volume = Math.max(0, Math.min(1, value)); if (this.master && this.context) this.master.gain.setTargetAtTime(this.volume * 0.4, this.context.currentTime, 0.1); }
  setHidden(hidden: boolean) { if (this.filter && this.context) this.filter.frequency.setTargetAtTime(hidden ? 550 : 18000, this.context.currentTime, 0.15); }
  setThreat(value: number) {
    this.threat = Math.max(0, Math.min(1, value));
    if (this.roomGain && this.context) this.roomGain.gain.setTargetAtTime(0.045 + this.threat * 0.16, this.context.currentTime, 0.6);
  }
  setRoom(room: string) {
    const frequencies: Record<string, number> = { hall: 47, kitchen: 61, living: 52, study: 39, pantry: 66, landing: 43, bedroom: 55, nursery: 36, bathroom: 72, attic: 31, cellar: 28, coal: 28, preserves: 34, hidden: 26, garden: 57, woods: 49, barn: 41 };
    if (this.roomTone && this.context) this.roomTone.frequency.setTargetAtTime(frequencies[room] ?? 47, this.context.currentTime, 0.7);
  }
  private tone(frequency: number, duration: number, volume: number, type: OscillatorType = 'sine', delay = 0, end?: number) {
    if (!this.context || !this.filter) return;
    const ctx = this.context, time = ctx.currentTime + delay;
    const oscillator = ctx.createOscillator(), gain = ctx.createGain();
    oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, time);
    if (end) oscillator.frequency.exponentialRampToValueAtTime(end, time + duration);
    gain.gain.setValueAtTime(0.0001, time); gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    oscillator.connect(gain); gain.connect(this.filter); oscillator.start(time); oscillator.stop(time + duration + 0.02);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }
  private noise(duration: number, volume: number, frequency: number) {
    if (!this.context || !this.filter) return;
    const ctx = this.context, source = ctx.createBufferSource(), band = ctx.createBiquadFilter(), gain = ctx.createGain();
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate), data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
    source.buffer = buffer; band.type = 'bandpass'; band.frequency.value = frequency; band.Q.value = 2;
    gain.gain.value = volume; source.connect(band); band.connect(gain); gain.connect(this.filter); source.start();
    source.onended = () => { source.disconnect(); band.disconnect(); gain.disconnect(); };
  }
  step() { this.noise(0.17, 0.13, 250); this.tone(110, 0.15, 0.035, 'triangle', 0, 73); }
  door() { this.tone(175, 0.65, 0.08, 'sawtooth', 0, 65); this.noise(0.4, 0.035, 650); }
  ping(vibrate: boolean) { if (vibrate) { this.tone(75, 0.15, 0.1, 'triangle'); this.tone(75, 0.15, 0.08, 'triangle', 0.2); } else { this.tone(880, 0.35, 0.3); this.tone(1174, 0.45, 0.23, 'sine', 0.12); } }
  hum(distance: number) { const gain = Math.max(0.006, 0.12 * (1 - Math.min(distance, 25) / 25)); const pitch = 1 - Math.min(distance, 25) * 0.003; [196, 220, 174.6, 164.8, 196].forEach((note, index) => this.tone(note * pitch, 0.65, gain, 'triangle', index * 0.55)); }
  catch() { this.noise(0.7, 0.27, 750); this.tone(110, 0.8, 0.22, 'sawtooth', 0, 28); }
  photo() { this.noise(0.09, 0.2, 2200); }
  lockFail() { this.noise(0.5, 0.3, 1450); this.tone(650, 0.2, 0.12, 'triangle', 0, 240); }
  tape() { this.noise(0.8, 0.08, 1500); this.tone(280, 1.8, 0.03, 'triangle', 0, 269); }
  stop() { if (this.heartbeat) clearInterval(this.heartbeat); this.heartbeat = undefined; this.roomTone?.stop(); this.roomTone = undefined; void this.context?.close(); this.context = undefined; this.master = undefined; this.filter = undefined; this.roomGain = undefined; }
}
