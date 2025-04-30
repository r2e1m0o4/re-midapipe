// camera_utils.js - نسخه ساده‌شده
class Camera {
  constructor(video, config) {
    this.video = video;
    this.config = config || {};
    this.stream = null;
  }
  
  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: this.config.width || 640,
          height: this.config.height || 480
        }
      });
      
      this.video.srcObject = this.stream;
      await new Promise((resolve) => {
        this.video.onloadedmetadata = () => {
          this.video.play();
          resolve();
        };
      });
      
      if (this.config.onFrame) {
        this.frameLoop();
      }
      
      return true;
    } catch (error) {
      console.error('Camera Error:', error);
      return false;
    }
  }
  
  frameLoop() {
    if (this.config.onFrame) {
      this.config.onFrame();
      requestAnimationFrame(() => this.frameLoop());
    }
  }
  
  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }
}