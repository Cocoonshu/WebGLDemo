'use strict'

class TextureTask {
  constructor(texture, listener) {
    this.mTexture  = texture;
    this.mListener = listener;
    this.mImage    = null;
  }

  decode(onLoadedListener) {
    if (this.mImage != null) {
      return;
    } else {
      let that = this;
      let onLoadHandler = function() {
        console.warn("[TextureProvider] Image '" + that.mImage.src + "' has loaded");
        if (that.mListener != null) {
          that.mListener(that);
        }
        if (onLoadedListener != null) {
          onLoadedListener(that);
        }
      };

      this.mImage             = new Image();
      this.mImage.onload      = onLoadHandler;
      this.mImage.crossOrigin = "";
      this.mImage.src         = this.mTexture.mTextureUrl;
      console.log("[TextureProvider] Image '" + this.mImage.src + "' loading...");
    }
  }
}

class ImagePool {
  constructor(cacheSize) {
    this.mCacheSize  = cacheSize <= 0 ? 1 : cacheSize;
    this.mCachePool  = new Map();
    this.mCacheQueue = [];
  }

  push(url, image) {
    if (url == null || image == null) {
      return;
    }

    while (this.mCachePool.size - this.mCacheSize >= 0) {
      let key = this.mCacheQueue.pop();
      if (key != null) {
        this.mCachePool.delete(key);
      }
    }
    this.mCachePool.set(url, image);
    this.mCacheQueue.push(url);
  }

  pop(url) {
    let image = this.mCachePool.get(url, image);
    let index = this.mCacheQueue.indexOf(url);
    if (index >= 0) {
      this.mCacheQueue.splice(index, 1);
    }
    this.mCachePool.delete(url);
    return image;
  }

  peek(url) {
    let image = this.mCachePool.get(url, image);
    if (image == null) {
      this.mCachePool.delete(url);
      let index = this.mCacheQueue.indexOf(url);
      if (index >= 0) {
        this.mCacheQueue.splice(index, 1);
      }
      this.mCachePool.delete(url);
    }
    return image;
  }

  getImage(url) {
    return this.mCachePool.get(url);
  }

  clear() {
    this.mCachePool.clear();
    this.mCacheQueue = [];
  }

}

class TextureProvider {
  constructor() {
    this.mTaskList  = [];
    this.mTaskMap   = new Map();
    this.mImagePool = new ImagePool(TextureProvider.CacheSize);
  }

  loadTexture(texture) {
    this.loadTexture(texture, null);
  }

  loadTexture(texture, listener) {
    let image = this.getImage(texture.mTextureUrl);
    if (image != null) {
      return;
    }

    let that = this;
    let task = this.mTaskMap.get(texture);
    if (task != null) {
      return;
    } else {
      task = new TextureTask(texture, listener);
      this.mTaskMap.set(texture, task);
      this.mTaskList.push(task);
      task.decode(function(task){
        that.onTaskDone(task);
      });
    }
  }

  hasImage(url) {
    return this.mImagePool.get(url) == null;
  }

  getImage(url) {
    return this.mImagePool.getImage(url);
  }

  onTaskDone(task) {
    let url   = task.mTexture.mTextureUrl;
    let image = task.mImage;
    if (url != null && image != null) {
      this.mImagePool.push(url, image);
    }
  }

}
TextureProvider.CacheSize = 16;
