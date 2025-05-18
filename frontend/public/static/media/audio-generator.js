// 音频生成工具
class AudioGenerator {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // 生成点击音效
    async generateClick() {
        const duration = 0.1;
        const buffer = await this.createBuffer(1, duration * 44100);
        const channelData = buffer.getChannelData(0);
        
        // 生成短促的点击声
        for (let i = 0; i < channelData.length; i++) {
            const t = i / 44100;
            channelData[i] = Math.sin(2 * Math.PI * 1000 * t) * Math.exp(-30 * t);
        }
        
        return this.exportWAV(buffer, 'click.mp3');
    }

    // 生成断开连接音效
    async generateDisconnect() {
        const duration = 0.3;
        const buffer = await this.createBuffer(1, duration * 44100);
        const channelData = buffer.getChannelData(0);
        
        // 生成下降音调的声音
        for (let i = 0; i < channelData.length; i++) {
            const t = i / 44100;
            const freq = 800 - 2000 * t;
            channelData[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-5 * t);
        }
        
        return this.exportWAV(buffer, 'disconnect.wav');
    }

    // 生成删除音效
    async generateDelete() {
        const duration = 0.2;
        const buffer = await this.createBuffer(1, duration * 44100);
        const channelData = buffer.getChannelData(0);
        
        // 生成短促的低音
        for (let i = 0; i < channelData.length; i++) {
            const t = i / 44100;
            const freq = 400 - 1000 * t;
            channelData[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-10 * t);
        }
        
        return this.exportWAV(buffer, 'delete.mp3');
    }

    // 创建音频缓冲区
    async createBuffer(channels, length) {
        return new AudioBuffer({
            length: length,
            numberOfChannels: channels,
            sampleRate: 44100
        });
    }

    // 导出为WAV文件
    exportWAV(audioBuffer, filename) {
        const numOfChan = audioBuffer.numberOfChannels;
        const length = audioBuffer.length * numOfChan * 2;
        const buffer = new ArrayBuffer(44 + length);
        const view = new DataView(buffer);
        let pos = 0;

        // 写入WAV文件头
        const writeString = (str) => {
            for (let i = 0; i < str.length; i++) {
                view.setUint8(pos + i, str.charCodeAt(i));
            }
            pos += str.length;
        };

        writeString('RIFF');
        view.setUint32(pos, 36 + length, true); pos += 4;
        writeString('WAVE');
        writeString('fmt ');
        view.setUint32(pos, 16, true); pos += 4;
        view.setUint16(pos, 1, true); pos += 2;
        view.setUint16(pos, numOfChan, true); pos += 2;
        view.setUint32(pos, 44100, true); pos += 4;
        view.setUint32(pos, 44100 * 2 * numOfChan, true); pos += 4;
        view.setUint16(pos, numOfChan * 2, true); pos += 2;
        view.setUint16(pos, 16, true); pos += 2;
        writeString('data');
        view.setUint32(pos, length, true); pos += 4;

        // 写入音频数据
        const channelData = audioBuffer.getChannelData(0);
        for (let i = 0; i < channelData.length; i++) {
            const sample = Math.max(-1, Math.min(1, channelData[i]));
            view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
            pos += 2;
        }

        // 创建Blob并下载
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
} 