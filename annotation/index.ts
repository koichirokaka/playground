class AnnotationDrawer {
  lineWidth = 5;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  pwidth: number;
  pheight: number;
  canvas: HTMLCanvasElement;
  isStart: boolean;
  isFinish: boolean;

  constructor(
    public elem: HTMLElement,
    public startCallback?: () => void,
    public finishCallback?: () => void
  ) {
    if (this.detectmob) {
      this.handleTouchstart = this.handleTouchstart.bind(this);
      this.handleTouchmove = this.handleTouchmove.bind(this);
      this.handleTouchend = this.handleTouchend.bind(this);
    } else {
      this.handleMousedown = this.handleMousedown.bind(this);
      this.handleMousemove = this.handleMousemove.bind(this);
      this.handleMouseup = this.handleMouseup.bind(this);
    }
  }

  init() {
    if (this.detectmob) {
      this.elem.addEventListener('touchstart', this.handleTouchstart);
      this.elem.addEventListener('touchmove', this.handleTouchmove);
      this.elem.addEventListener('touchend', this.handleTouchend);
    } else {
      this.elem.addEventListener('mousedown', this.handleMousedown);
      this.elem.addEventListener('mousemove', this.handleMousemove);
      this.elem.addEventListener('mouseup', this.handleMouseup);
    }
  }

  get detectmob() {
    if (window.innerWidth <= 800 && window.innerHeight <= 600) {
      return true;
    } else {
      return false;
    }
  }

  handleTouchstart(ev: TouchEvent) {
    ev.preventDefault();
    if (!this.isFinish) {
      console.log('start', ev);
      this.isStart = true;
      this.x1 = ev.touches[0].pageX;
      this.y1 = ev.touches[0].pageY;
      this.canvas = this.createCanvas();
      this.elem.appendChild(this.canvas);
      if (this.startCallback) {
        this.startCallback();
      }
    }
  }

  handleTouchmove(ev: TouchEvent) {
    ev.preventDefault();
    if (this.isStart) {
      console.log('move', ev);
      this.x2 = ev.touches[0].pageX;
      this.y2 = ev.touches[0].pageY;
      this.draw();
    }
  }

  handleTouchend(ev: TouchEvent) {
    ev.preventDefault();
    if (this.isStart) {
      console.log('up', ev);
      this.x2 = ev.touches[0].pageX;
      this.y2 = ev.touches[0].pageY;
      this.draw();
      this.isFinish = true;
      this.isStart = false;
      if (this.finishCallback) {
        this.finishCallback();
      }
    }
  }

  handleMousedown(ev: MouseEvent) {
    ev.preventDefault();
    if (!this.isFinish) {
      console.log('down', ev);
      this.isStart = true;
      this.x1 = ev.offsetX;
      this.y1 = ev.offsetY;
      this.canvas = this.createCanvas();
      this.elem.appendChild(this.canvas);
      if (this.startCallback) {
        this.startCallback();
      }
    }
  }

  handleMousemove(ev: MouseEvent) {
    ev.preventDefault();
    if (this.isStart) {
      console.log('move', ev);
      this.x2 = ev.offsetX;
      this.y2 = ev.offsetY;
      this.draw();
    }
  }

  handleMouseup(ev: MouseEvent) {
    ev.preventDefault();
    if (this.isStart) {
      console.log('up', ev);
      this.x2 = ev.offsetX;
      this.y2 = ev.offsetY;
      this.draw();
      this.isFinish = true;
      this.isStart = false;
      if (this.finishCallback) {
        this.finishCallback();
      }
    }
  }

  draw() {
    if (this.isFinish) {
      return;
    }
    this.elem.removeChild(this.canvas);
    this.canvas = this.createCanvas();
    this.elem.appendChild(this.canvas);
    const ctx = this.canvas.getContext('2d');
    let width = this.x2 - this.x1;
    this.pwidth = width;
    let height = this.y2 - this.y1;
    this.pheight = height;
    console.log('point', this.x1, this.y1, width, height);
    ctx.rect(this.x1, this.y1, width, height);
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }

  clear() {
    if (this.detectmob) {
      this.elem.removeEventListener('touchstart', this.handleTouchstart);
      this.elem.removeEventListener('touchmove', this.handleTouchmove);
      this.elem.removeEventListener('touchend', this.handleTouchend);
    } else {
      this.elem.removeEventListener('mousedown', this.handleMousedown);
      this.elem.removeEventListener('mousemove', this.handleMousemove);
      this.elem.removeEventListener('mouseup', this.handleMouseup);
    }
    if (this.canvas) {
      this.elem.removeChild(this.canvas);
    }
    this.x1 = null;
    this.x2 = null;
    this.y1 = null;
    this.y2 = null;
    this.pwidth = null;
    this.pheight = null;
    this.canvas = null;
    this.isFinish = false;
  }

  createCanvas() {
    let canvas = document.createElement('canvas');
    canvas.style.zIndex = '99';
    canvas.style.position = 'absolute';
    canvas.style.left = this.elem.offsetLeft.toString() + 'px';
    canvas.style.top = this.elem.offsetTop.toString() + 'px';
    canvas.width = this.elem.offsetWidth;
    canvas.height = this.elem.offsetHeight;
    return canvas;
  }

  drawImage(
    source: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
    size: { x: number; y: number }
  ) {
    let canvas = this.createCanvas();
    canvas.width = size.x;
    canvas.height = size.y;
    let ctx = canvas.getContext('2d');
    let width;
    let height;
    if (source instanceof HTMLVideoElement) {
      width = source.videoWidth;
      height = source.videoHeight;
    } else if (source instanceof HTMLCanvasElement) {
      width = source.width;
      height = source.height;
    } else if (source instanceof HTMLImageElement) {
      width = source.naturalWidth;
      height = source.naturalHeight;
    } else {
      return '';
    }
    const ratioW = width / source.clientWidth;
    const ratioH = height / source.clientHeight;
    console.log(
      'point: ',
      ratioW,
      ratioH,
      this.x1,
      this.y1,
      this.pwidth,
      this.pheight
    );
    ctx.drawImage(
      source,
      this.x1 * ratioW,
      this.y1 * ratioH,
      this.pwidth * ratioW,
      this.pheight * ratioH,
      0,
      0,
      canvas.width,
      canvas.height
    );
    return canvas.toDataURL();
  }
}

const getVideoFrame = (videoElem: HTMLVideoElement): HTMLCanvasElement => {
  const captureImg = <HTMLCanvasElement>document.getElementById('capture-img');
  captureImg.style.left = videoElem.offsetLeft.toString() + 'px';
  captureImg.style.top = videoElem.offsetTop.toString() + 'px';
  captureImg.width = videoElem.offsetWidth;
  captureImg.height = videoElem.offsetHeight;
  const captureImgCtx = captureImg.getContext('2d');
  captureImgCtx.drawImage(videoElem, 0, 0, captureImg.width, captureImg.height);
  return captureImg;
};

const setup = async () => {
  let container = document.getElementById('container');
  let annotation = new AnnotationDrawer(container);
  let reset = <HTMLButtonElement>document.getElementById('reset');
  reset.addEventListener('click', () => {
    annotation.clear();
    const captureImg = <HTMLImageElement>document.getElementById('capture-img');
    captureImg.remove();
    filePhoto.style.display = 'block';
  });

  let check = <HTMLButtonElement>document.getElementById('check');
  check.addEventListener('click', () => {
    const captureImg = <HTMLImageElement>document.getElementById('capture-img');
    let url = annotation.drawImage(captureImg, { x: 224, y: 224 });
    const checkimg = <HTMLImageElement>document.getElementById('check-img');
    checkimg.src = url;
  });

  const filePhoto = <HTMLInputElement>document.getElementById('file-photo');
  filePhoto.addEventListener('change', () => {
    let file = filePhoto.files[0];
    let reader = new FileReader();
    reader.addEventListener('load', (ev: any) => {
      let captureImg = document.createElement('img');
      captureImg.src = ev.target.result;
      captureImg.id = 'capture-img';
      filePhoto.style.display = 'none';
      container.appendChild(captureImg);
      annotation.init();
    });
    reader.readAsDataURL(file);
  });
};

setup();
