// 音效资源配置
export const SOUND_RESOURCES = {
  CLICK: '/static/media/click.mp3',
  DISCONNECT: '/static/media/disconnect.wav',
  DELETE: '/static/media/delete.mp3'
};

// 图片资源配置
export const IMAGE_RESOURCES = {
  SPRITES: '/static/media/sprites.png'
};

// 资源加载状态管理
export const loadResources = async () => {
  const resources = {
    sounds: {} as Record<string, HTMLAudioElement>,
    images: {} as Record<string, HTMLImageElement>
  };

  // 预加载音效
  const loadSound = (key: string, path: string) => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.src = path;
      audio.oncanplaythrough = () => {
        resources.sounds[key] = audio;
        resolve(audio);
      };
      audio.onerror = reject;
    });
  };

  // 预加载图片
  const loadImage = (key: string, path: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        resources.images[key] = img;
        resolve(img);
      };
      img.onerror = reject;
    });
  };

  try {
    // 加载所有音效
    await Promise.all([
      loadSound('CLICK', SOUND_RESOURCES.CLICK),
      loadSound('DISCONNECT', SOUND_RESOURCES.DISCONNECT),
      loadSound('DELETE', SOUND_RESOURCES.DELETE)
    ]);

    // 加载所有图片
    await Promise.all([
      loadImage('SPRITES', IMAGE_RESOURCES.SPRITES)
    ]);

    return resources;
  } catch (error) {
    console.warn('资源加载失败：', error);
    // 返回空资源对象，允许应用继续运行
    return resources;
  }
};

// 播放音效的工具函数
export const playSound = (audio: HTMLAudioElement) => {
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(error => {
      console.warn('音效播放失败：', error);
    });
  }
}; 