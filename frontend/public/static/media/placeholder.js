// 生成简单的音频文件
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// 生成点击音效
function generateClickSound() {
    const duration = 0.1;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 1000;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
    
    // 导出为音频文件
    const offlineContext = new OfflineAudioContext(2, 44100 * duration, 44100);
    oscillator.connect(offlineContext.destination);
    offlineContext.startRendering().then(buffer => {
        const wav = audioBufferToWav(buffer);
        downloadBlob(wav, 'click.mp3');
    });
}

// 生成断开连接音效
function generateDisconnectSound() {
    const duration = 0.3;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
    
    // 导出为音频文件
    const offlineContext = new OfflineAudioContext(2, 44100 * duration, 44100);
    oscillator.connect(offlineContext.destination);
    offlineContext.startRendering().then(buffer => {
        const wav = audioBufferToWav(buffer);
        downloadBlob(wav, 'disconnect.wav');
    });
}

// 生成删除音效
function generateDeleteSound() {
    const duration = 0.2;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
    
    // 导出为音频文件
    const offlineContext = new OfflineAudioContext(2, 44100 * duration, 44100);
    oscillator.connect(offlineContext.destination);
    offlineContext.startRendering().then(buffer => {
        const wav = audioBufferToWav(buffer);
        downloadBlob(wav, 'delete.mp3');
    });
}

// 工具函数：将AudioBuffer转换为WAV格式
function audioBufferToWav(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2;
    const buffer = new ArrayBuffer(44 + length);
    const view = new DataView(buffer);
    const channels = [];
    let pos = 0;
    
    // 写入WAV文件头
    writeString(view, pos, 'RIFF'); pos += 4;
    view.setUint32(pos, 36 + length, true); pos += 4;
    writeString(view, pos, 'WAVE'); pos += 4;
    writeString(view, pos, 'fmt '); pos += 4;
    view.setUint32(pos, 16, true); pos += 4;
    view.setUint16(pos, 1, true); pos += 2;
    view.setUint16(pos, numOfChan, true); pos += 2;
    view.setUint32(pos, buffer.sampleRate, true); pos += 4;
    view.setUint32(pos, buffer.sampleRate * 2 * numOfChan, true); pos += 4;
    view.setUint16(pos, numOfChan * 2, true); pos += 2;
    view.setUint16(pos, 16, true); pos += 2;
    writeString(view, pos, 'data'); pos += 4;
    view.setUint32(pos, length, true); pos += 4;
    
    // 写入音频数据
    for (let i = 0; i < buffer.numberOfChannels; i++) {
        channels.push(buffer.getChannelData(i));
    }
    
    while (pos < view.byteLength) {
        for (let i = 0; i < numOfChan; i++) {
            const sample = Math.max(-1, Math.min(1, channels[i][pos]));
            view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
            pos += 2;
        }
    }
    
    return buffer;
}

// 工具函数：写入字符串到DataView
function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

// 工具函数：下载Blob
function downloadBlob(buffer, filename) {
    const blob = new Blob([buffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
} 