let controlIndex = PANOLENS.CONTROLS.ORBIT;
let modeIndex = 0;
const container = document.getElementById('container');
const controlButton = document.getElementById("controlButton");
const modeButton = document.getElementById("modeButton");
const panorama1Button = document.getElementById('btn1');
const panorama2Button = document.getElementById('btn2');
const playAudioButton = document.getElementById('playButton');
const pauseAudioButton = document.getElementById('pauseButton');
const videoButton = document.getElementById('playVideo');
const infospot = new PANOLENS.Infospot(350, PANOLENS.DataImage.Info);
const panorama1 = new PANOLENS.ImagePanorama('https://live.staticflickr.com/65535/48501203321_cd550a3ec8_o.jpg');
const panorama2 = new PANOLENS.ImagePanorama('https://live.staticflickr.com/65535/48501207836_00db8ec7f3_o.jpg');
const panoVideo =  new PANOLENS.VideoPanorama( 'https://pchen66.github.io/Panolens/examples/asset/textures/video/1941-battle-low.mp4');
const viewer = new PANOLENS.Viewer({ container: container, output: 'console', 
autoRotate: true, autoRotateSpeed: 1, autoRotateActivationDuration: 5000 });
const listener = new THREE.AudioListener();
const audioLoader = new THREE.AudioLoader();
const sound = new THREE.PositionalAudio(listener);
let audioBuffer = null;

controlButton.addEventListener('click', function() {
  controlIndex = controlIndex >= 1 ? 0 : controlIndex + 1;
  switch(controlIndex) {
    case 0: viewer.enabledControl(PANOLENS.CONTROLSORBIT); break;
    case 1: viewer.enabledControl(PANOLENS.MODES.DEVICEORIENTATION); break;
    default: break;
  }
});
modeButton.addEventListener('click', function() {
  modeIndex = modeIndex >= 2 ? 0 : modeIndex + 1;
  switch(modeIndex) {
    case 0: viewer.disabledEffect(); break;
    case 1: viewer.enabledEffect(PANOLENS.MODES.CARDBOARD); break;
    case 2: viewer.enabledEffect(PANOLENS.MODES.STEREO); break;
    default: break;
  }
});
panorama1Button.addEventListener('click', function(){
  viewer.setPanorama(panorama1);
});
panorama2Button.addEventListener('click', function(){
  viewer.setPanorama(panorama2);
});
videoButton.addEventListener('click', function(){
  viewer.setPanorama(panoVideo);
});

audioLoader.load('https://threejs.org/examples/sounds/358232_j_s_song.mp3', 
  function(buffer) {
    audioBuffer = buffer;
    sound.setBuffer(buffer);
    playAudioButton.addEventListener('click', function() {
      sound.play();
    })
    pauseAudioButton.addEventListener('click', function() {
      sound.stop()
    })
  }
)

infospot.position.set(0, 0, -5000);
infospot.addHoverText('The city of Angels', 30);
panorama1.add(infospot);
viewer.getCamera().add(listener);
viewer.add(panorama1, panorama2, panoVideo);
viewer.addUpdateCallback(function() {})

// // To restrain the Camera controls
// // Vertical Movement
// viewer.OrbitControls.minPolarAngle = Math.PI / 3; 
// viewer.OrbitControls.maxPolarAngle = Math.PI * 2 / 3; 
// // Horizontal Movement
// viewer.OrbitControls.minAzimuthAngle = - Math.PI / 3; 
// viewer.OrbitControls.maxAzimuthAngle = Math.PI / 3; 
// // Momentum
// viewer.OrbitControls.momentumDampingFactor = 0.75; 
// viewer.OrbitControls.momentumScalingFactor = -0.01; 
// viewer.OrbitControls.momentumKeydownFactor = 10; 
// // Fov
// viewer.OrbitControls.minFov = 50;
// viewer.OrbitControls.maxFov = 160;
// // Zoom
// viewer.OrbitControls.noZoom = true;


