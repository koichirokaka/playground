navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  let video = document.querySelector('video');
  video.src = URL.createObjectURL(stream);
});

let captureButton = document.getElementById('capture');
captureButton.addEventListener('click', () => {
  let video = document.querySelector('video');
  let c1 = document.getElementById('c1');
  c1.width = 128;
  c1.height = 128;
  let ctx1 = c1.getContext('2d');
  ctx1.drawImage(video, 100, 100, 300, 300, 0, 0, 128, 128);
  let c2 = document.getElementById('c2');
  c2.width = 300;
  c2.height = 300;
  let ctx2 = c2.getContext('2d');
  ctx2.drawImage(video, 100, 100, 400, 400, 0, 0, 300, 300);
});
