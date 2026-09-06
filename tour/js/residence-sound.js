/* Embedded in both delivery pages. Procedural foley; no audio files or network. */
(() => {
  'use strict';
  if (window.ResidenceSound) return;
  function createSound() {
    const catalog = Object.freeze({
      'key': 'Lock keypad digit', 'erase': 'Lock keypad delete',
      'accepted': 'Access accepted', 'denied': 'Incorrect access code',
      'deadbolt': 'Electronic lock motor and bolt', 'entry-open': 'Entry door opening',
      'door-handle': 'Interior door handle and latch', 'door-close': 'Interior door closing and latch',
      'window-handle': 'Operable window handle', 'window-close': 'Window seal and catch',
      'slider-move': 'Sliding door or mirrored robe track', 'slider-stop': 'Sliding panel soft stop',
      'garage-move': 'Sectional garage door motor', 'garage-stop': 'Garage door motor stop',
      'cabinet-open': 'Mirror cabinet hinge', 'cabinet-close': 'Mirror cabinet soft close',
      'light-switch': 'Wall light switch',
      'water-bath': 'Gentle bath water filling', 'water-shower': 'Gentle shower spray',
      'water-basin': 'Gentle basin water stream', 'water-drain': 'Gentle water draining',
      'tap-control': 'Tap start or stop control'
    });
    const listeners = new Set(), voices = new Set();
    let context = null, master = null, noiseBuffer = null, armed = false, muted = false;
    function arm(event) {
      if (!event?.isTrusted) return;
      armed = true;
      if (muted) return;
      try {
        if (!context) {
          const Audio = window.AudioContext || window.webkitAudioContext;
          if (!Audio) return;
          context = new Audio();
          master = context.createGain(); master.gain.value = .48;
          const limiter = context.createDynamicsCompressor();
          limiter.threshold.value = -14; limiter.knee.value = 12; limiter.ratio.value = 5;
          master.connect(limiter); limiter.connect(context.destination);
          noiseBuffer = context.createBuffer(1, context.sampleRate, context.sampleRate);
          const samples = noiseBuffer.getChannelData(0); let seed = 932847;
          for (let i = 0; i < samples.length; i++) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; samples[i] = seed / 2147483648 - 1; }
        }
        if (context.state === 'suspended') context.resume().catch(() => {});
      } catch (_) { context = null; }
    }
    function setMuted(value) {
      muted = Boolean(value);
      if (master) master.gain.setTargetAtTime(muted ? 0 : .48, context.currentTime, .015);
      if (muted) for (const voice of voices) { try { voice.stop(); } catch (_) {} }
      listeners.forEach(fn => fn(muted));
    }
    function voice(kind, frequency, duration, volume, delay = 0, endFrequency = frequency) {
      if (!context || !master || !armed || muted || context.state !== 'running' || voices.size >= 28) return;
      const start = context.currentTime + delay, envelope = context.createGain();
      let source, filter;
      if (kind === 'noise') {
        source = context.createBufferSource(); source.buffer = noiseBuffer; source.loop = true;
        filter = context.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = frequency; filter.Q.value = .65;
        source.connect(filter); filter.connect(envelope);
      } else {
        source = context.createOscillator(); source.type = kind;
        source.frequency.setValueAtTime(frequency, start);
        source.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), start + duration);
        source.connect(envelope);
      }
      envelope.gain.setValueAtTime(.00001, start);
      envelope.gain.exponentialRampToValueAtTime(Math.max(.0001, volume), start + Math.min(.012, duration * .15));
      envelope.gain.exponentialRampToValueAtTime(.00001, start + duration);
      envelope.connect(master); voices.add(source);
      source.onended = () => { voices.delete(source); source.disconnect(); filter?.disconnect(); envelope.disconnect(); };
      source.start(start); source.stop(start + duration + .025);
    }
    function flowVoice(frequency, duration, volume, delay = 0) {
      if (!context || !master || !armed || muted || context.state !== 'running' || voices.size >= 28) return;
      const start=context.currentTime+delay,end=start+duration;
      const source=context.createBufferSource();source.buffer=noiseBuffer;source.loop=true;
      const body=context.createBiquadFilter();body.type='bandpass';body.frequency.value=frequency;body.Q.value=.34;
      const soften=context.createBiquadFilter();soften.type='lowpass';soften.frequency.value=Math.min(6800,Math.max(1100,frequency*2.05));soften.Q.value=.22;
      const envelope=context.createGain();
      source.connect(body);body.connect(soften);soften.connect(envelope);envelope.connect(master);
      envelope.gain.setValueAtTime(.00001,start);
      envelope.gain.linearRampToValueAtTime(volume,start+Math.min(.10,duration*.20));
      envelope.gain.setValueAtTime(volume,start+Math.max(.12,duration-.24));
      envelope.gain.exponentialRampToValueAtTime(.00001,end);
      voices.add(source);
      source.onended=()=>{voices.delete(source);source.disconnect();body.disconnect();soften.disconnect();envelope.disconnect();};
      source.start(start);source.stop(end+.025);
    }
    function play(name) {
      if (!catalog[name] || !armed || muted || !context || context.state !== 'running') return false;
      const sine = (f, d, v, t = 0, end = f) => voice('sine', f, d, v, t, end);
      const noise = (f, d, v, t = 0) => voice('noise', f, d, v, t);
      switch (name) {
        case 'key': sine(770, .065, .055); break;
        case 'erase': sine(510, .05, .04); break;
        case 'accepted': sine(660, .12, .052); sine(880, .18, .047, .13); break;
        case 'denied': sine(245, .12, .05); sine(196, .19, .045, .14); break;
        case 'deadbolt': noise(560, .44, .04); sine(138, .39, .017, 0, 104); noise(1700, .055, .11, .39); sine(118, .09, .055, .4, 72); break;
        case 'entry-open': noise(720, .43, .022); noise(1450, .035, .035); break;
        case 'door-handle': noise(1700, .05, .07); sine(2100, .035, .018); noise(900, .035, .05, .095); break;
        case 'door-close': sine(118, .16, .13, 0, 54); noise(580, .09, .12); noise(1900, .045, .07, .08); break;
        case 'window-handle': noise(2150, .045, .065); sine(1380, .04, .02, .02); break;
        case 'window-close': noise(410, .12, .09); noise(1900, .04, .045, .06); break;
        case 'slider-move': noise(1150, .67, .045); noise(2300, .24, .018, .09); break;
        case 'slider-stop': noise(360, .115, .095); sine(95, .09, .05, 0, 62); break;
        case 'garage-move': voice('triangle', 91, .8, .021, 0, 79); noise(370, .8, .05); break;
        case 'garage-stop': noise(410, .16, .06); break;
        case 'cabinet-open': noise(1700, .045, .037); noise(950, .20, .015, .04); break;
        case 'cabinet-close': noise(480, .12, .065); sine(160, .06, .025, 0, 100); break;
        case 'light-switch': noise(2450, .029, .085); noise(1250, .025, .04, .023); break;
        case 'tap-control': sine(920, .035, .025); noise(2100, .035, .045); break;
        case 'water-bath': flowVoice(900,1.05,.018);flowVoice(1800,1.00,.006,.03);break;
        case 'water-shower': flowVoice(2350,1.05,.017);flowVoice(4100,.98,.006,.05);break;
        case 'water-basin': flowVoice(1350,.96,.014);flowVoice(2900,.90,.005,.04);break;
        case 'water-drain': flowVoice(420,1.05,.012);flowVoice(820,.95,.004,.05);break;
      }
      return true;
    }
    return Object.freeze({ catalog, arm, play, setMuted, get muted() { return muted; }, subscribe(fn) { listeners.add(fn); fn(muted); return () => listeners.delete(fn); } });
  }
  let shared;
  try { if (parent !== window) shared = parent.ResidenceSound; } catch (_) {}
  const sound = window.ResidenceSound = shared || createSound();
  document.addEventListener('pointerdown', event => sound.arm(event), {capture: true, passive: true});
  document.addEventListener('keydown', event => sound.arm(event), {capture: true});
  function bind() {
    document.querySelectorAll('[data-residence-sound]').forEach(button => {
      sound.subscribe(muted => {
        button.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.5 5.25 6.1 9H3.75v6h2.35l4.4 3.75Z"/>' + (muted ? '<path d="m15.6 9.6 4.8 4.8m0-4.8-4.8 4.8"/>' : '<path d="M14.8 8.4a5.2 5.2 0 0 1 0 7.2m3-10a9 9 0 0 1 0 12.8"/>') + '</svg>';
        button.setAttribute('aria-pressed', String(!muted));
        button.setAttribute('aria-label', muted ? 'Enable interaction sounds' : 'Mute interaction sounds');
        button.title = muted ? 'Enable sound' : 'Mute sound';
      });
      button.addEventListener('click', event => { sound.setMuted(!sound.muted); sound.arm(event); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, {once: true}); else bind();
})();
