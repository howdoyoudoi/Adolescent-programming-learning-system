const fs = require('fs');
const path = require('path');

// 定义需要复制的文件
const mediaFiles = [
  {
    source: '../node_modules/blockly/media/click.mp3',
    target: 'click.mp3'
  },
  {
    source: '../node_modules/blockly/media/delete.mp3',
    target: 'delete.mp3'
  },
  {
    source: '../node_modules/blockly/media/disconnect.wav',
    target: 'disconnect.wav'
  },
  {
    source: '../node_modules/blockly/media/sprites.png',
    target: 'sprites.png'
  }
];

// 确保目录存在
const createDirIfNotExists = (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`创建目录: ${dirPath}`);
    }
  } catch (error) {
    console.error(`创建目录失败 ${dirPath}:`, error.message);
    throw error;
  }
};

// 复制文件
const copyFile = (sourcePath, targetPath) => {
  return new Promise((resolve, reject) => {
    console.log(`复制文件: ${path.basename(sourcePath)} -> ${targetPath}`);
    
    try {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`复制完成: ${path.basename(targetPath)}`);
      resolve();
    } catch (error) {
      console.error(`复制失败:`, error.message);
      reject(error);
    }
  });
};

// 主函数
async function main() {
  try {
    // 创建必要的目录
    const mediaDir = path.join(__dirname, '../public/static/media');
    createDirIfNotExists(mediaDir);

    console.log('开始复制媒体文件...');
    
    // 复制所有文件
    for (const file of mediaFiles) {
      const sourcePath = path.join(__dirname, file.source);
      const targetPath = path.join(
        __dirname,
        '../public/static/media',
        file.target
      );
      
      try {
        await copyFile(sourcePath, targetPath);
      } catch (error) {
        console.error(`处理 ${file.target} 失败:`, error.message);
      }
    }
    
    console.log('所有文件复制完成！');
  } catch (error) {
    console.error('发生错误:', error.message);
    process.exit(1);
  }
}

main();