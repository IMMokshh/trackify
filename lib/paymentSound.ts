// Payment success sound — plays a short coin/success chime
// Uses Web Audio API so no external file needed

export function playPaymentSuccessSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    const playTone = (freq: number, startTime: number, duration: number, gain: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    // Ascending success chime: C5 → E5 → G5 → C6
    playTone(523.25, now, 0.18, 0.4);
    playTone(659.25, now + 0.12, 0.18, 0.4);
    playTone(783.99, now + 0.24, 0.18, 0.4);
    playTone(1046.5, now + 0.36, 0.35, 0.5);
  } catch {
    // Silently fail if Web Audio API is unavailable
  }
}
