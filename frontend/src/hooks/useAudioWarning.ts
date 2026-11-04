"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface AudioWarningOptions {
  initialMuted?: boolean;
  initialVolume?: number; // 0.0 to 1.0
}

export function useAudioWarning(options: AudioWarningOptions = {}) {
  const { initialMuted = false, initialVolume = 0.8 } = options;

  const audioCtxRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [volume, setVolume] = useState(initialVolume);
  const [isAudioReady, setIsAudioReady] = useState(false);

  // Lazy initialization of AudioContext on first interaction or explicitly
  const getOrCreateAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;

    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }

      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume().then(() => setIsAudioReady(true));
      } else if (audioCtxRef.current && audioCtxRef.current.state === "running") {
        setIsAudioReady(true);
      }

      return audioCtxRef.current;
    } catch (err) {
      console.warn("Web Audio API not supported or blocked by browser policy:", err);
      return null;
    }
  }, []);

  const initAudio = useCallback(() => {
    getOrCreateAudioContext();
  }, [getOrCreateAudioContext]);

  /**
   * Tick Warning Beep:
   * Detak nada mendesak yang meningkat pada 10 detik terakhir.
   * Urgency scale: 10 (santai/permulaan) down to 1 (sangat kritis).
   */
  const playTickWarning = useCallback(
    (urgencyRemainingSeconds: number = 10) => {
      if (isMuted) return;
      const ctx = getOrCreateAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Menghitung frekuensi naik dari 750 Hz (10s) hingga 1500 Hz (1s)
      const clampedSeconds = Math.max(1, Math.min(10, urgencyRemainingSeconds));
      // Faktor urgensi: 0 (pada 10s) -> 1 (pada 1s)
      const urgencyFactor = (11 - clampedSeconds) / 10;
      const baseFreq = 700 + urgencyFactor * 750;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Gunakan kombinasi triangle/sine untuk suara 'woodblock/high beep' yang jernih & tidak menusuk telinga
      osc.type = clampedSeconds <= 3 ? "square" : "sine";
      osc.frequency.setValueAtTime(baseFreq, now);

      // Pitch glide sedikit ke bawah untuk memberi efek "tock" dinamis
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.85, now + 0.08);

      const targetGain = Math.min(1.0, volume * (0.4 + urgencyFactor * 0.4));
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(targetGain, now + 0.008);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + (clampedSeconds <= 3 ? 0.12 : 0.08));

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);

      // Jika waktu sangat kritis (<= 3 detik), tambahkan nada kedua (double tick)
      if (clampedSeconds <= 3) {
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = "sine";
        subOsc.frequency.setValueAtTime(baseFreq * 1.5, now + 0.05);

        subGain.gain.setValueAtTime(0.0001, now + 0.05);
        subGain.gain.linearRampToValueAtTime(targetGain * 0.5, now + 0.055);
        subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

        subOsc.connect(subGain);
        subGain.connect(ctx.destination);

        subOsc.start(now + 0.05);
        subOsc.stop(now + 0.15);
      }
    },
    [isMuted, volume, getOrCreateAudioContext]
  );

  /**
   * Final Buzzer:
   * Penanda waktu habis khas bel game show/debat kelas.
   * Menggabungkan dua osilator sawtooth rendah dengan efek detune disonan.
   */
  const playFinalBuzzer = useCallback(() => {
    if (isMuted) return;
    const ctx = getOrCreateAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.75; // 750ms

    // Dual oscillator untuk tekstur buzzer tebal
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sawtooth";
    osc2.type = "sawtooth";

    // Frekuensi buzzer khas ~220Hz (A3) dengan detuning 12Hz untuk efek "bzzzz"
    osc1.frequency.setValueAtTime(220, now);
    osc2.frequency.setValueAtTime(232, now);

    // Filter low-pass agar suara tidak terlalu menusuk
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, now);

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(volume * 0.85, now + 0.02);
    gainNode.gain.setValueAtTime(volume * 0.85, now + duration - 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }, [isMuted, volume, getOrCreateAudioContext]);

  /**
   * Success Chime:
   * Bunyi harmonis saat murid berhasil menyelesaikan argumen atau klaim token.
   */
  const playSuccessChime = useCallback(() => {
    if (isMuted) return;
    const ctx = getOrCreateAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Arpeggio Mayor)
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      const noteTime = now + idx * 0.07;
      gainNode.gain.setValueAtTime(0.0001, noteTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.45, noteTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.4);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.45);
    });
  }, [isMuted, volume, getOrCreateAudioContext]);

  /**
   * Sound effect untuk feedback klik tombol token
   */
  const playClick = useCallback(() => {
    if (isMuted) return;
    const ctx = getOrCreateAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);

    gainNode.gain.setValueAtTime(volume * 0.25, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }, [isMuted, volume, getOrCreateAudioContext]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Cleanup saat unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        try {
          audioCtxRef.current.close();
        } catch {
          // Ignore close errors
        }
      }
    };
  }, []);

  return {
    isAudioReady,
    isMuted,
    volume,
    initAudio,
    setVolume,
    toggleMute,
    playTickWarning,
    playFinalBuzzer,
    playSuccessChime,
    playClick,
  };
}

