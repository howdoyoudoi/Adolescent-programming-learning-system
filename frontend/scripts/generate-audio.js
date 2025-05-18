import fs from 'fs';
import path from 'path';
import AudioGenerator from '../src/utils/audio-generator.js';

const generator = new AudioGenerator();
const outputDir = path.resolve('public/static/media');

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 生成点击音效
const clickBlob = generator.generateClick();
fs.writeFileSync(path.join(outputDir, 'click.mp3'), Buffer.from(await clickBlob.arrayBuffer()));

// 生成断开连接音效
const disconnectBlob = generator.generateDisconnect();
fs.writeFileSync(path.join(outputDir, 'disconnect.wav'), Buffer.from(await disconnectBlob.arrayBuffer()));

// 生成删除音效
const deleteBlob = generator.generateDelete();
fs.writeFileSync(path.join(outputDir, 'delete.mp3'), Buffer.from(await deleteBlob.arrayBuffer()));

console.log('音效文件生成完成！'); 