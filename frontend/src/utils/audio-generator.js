class AudioGenerator {
  constructor() {
    this.sampleRate = 44100;
    this.bitDepth = 16;
  }

  generateClick() {
    const duration = 0.1; // 100ms
    const samples = Math.floor(this.sampleRate * duration);
    const data = new Float32Array(samples);
    
    for (let i = 0; i < samples; i++) {
      const t = i / this.sampleRate;
      data[i] = Math.sin(2 * Math.PI * 1000 * t) * Math.exp(-30 * t);
    }
    
    return this.createWavFile(data);
  }

  generateDisconnect() {
    const duration = 0.3; // 300ms
    const samples = Math.floor(this.sampleRate * duration);
    const data = new Float32Array(samples);
    
    for (let i = 0; i < samples; i++) {
      const t = i / this.sampleRate;
      const freq = 800 - 4000 * t;
      data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-10 * t);
    }
    
    return this.createWavFile(data);
  }

  generateDelete() {
    const duration = 0.2; // 200ms
    const samples = Math.floor(this.sampleRate * duration);
    const data = new Float32Array(samples);
    
    for (let i = 0; i < samples; i++) {
      const t = i / this.sampleRate;
      const freq = 400 - 3000 * t;
      data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-15 * t);
    }
    
    return this.createWavFile(data);
  }

  createWavFile(audioData) {
    const dataLength = audioData.length * 2; // 16-bit = 2 bytes per sample
    const fileLength = 44 + dataLength; // WAV header = 44 bytes
    
    const buffer = new ArrayBuffer(fileLength);
    const view = new DataView(buffer);
    
    // WAV Header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF'); // ChunkID
    view.setUint32(4, fileLength - 8, true); // ChunkSize
    writeString(8, 'WAVE'); // Format
    writeString(12, 'fmt '); // Subchunk1ID
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
    view.setUint16(22, 1, true); // NumChannels (1 for mono)
    view.setUint32(24, this.sampleRate, true); // SampleRate
    view.setUint32(28, this.sampleRate * 2, true); // ByteRate
    view.setUint16(32, 2, true); // BlockAlign
    view.setUint16(34, this.bitDepth, true); // BitsPerSample
    writeString(36, 'data'); // Subchunk2ID
    view.setUint32(40, dataLength, true); // Subchunk2Size
    
    // Audio Data
    const offset = 44;
    for (let i = 0; i < audioData.length; i++) {
      const sample = Math.max(-1, Math.min(1, audioData[i]));
      const value = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset + i * 2, value, true);
    }
    
    return new Blob([buffer], { type: 'audio/wav' });
  }
}

export default AudioGenerator; 