//------------------Scene & Camera & Controls------------------
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
document.addEventListener('mousemove', onDocumentMouseMove, false);

//------------------Drawables------------------
let circle = new THREE.Mesh(new THREE.CircleBufferGeometry(1, 100), new THREE.MeshBasicMaterial( {color: 0x168EFB}));
scene.add(circle);
let background = new THREE.Mesh(new THREE.CircleBufferGeometry(90, 100), new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'bg.webp' ) } ));
background.position.z = -130;
scene.add(background);



var listener = new THREE.AudioListener();

    // create an Audio source
    var sound = new THREE.Audio(listener);

    // load a sound and set it as the Audio object's buffer
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load('break.mp3', function (buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);
    });

    var analyser = new THREE.AudioAnalyser(sound, 32);

    // get the average frequency of the sound
    var data = analyser.getAverageFrequency();
    document.getElementById("button").addEventListener("click", play);

    function play() {
      sound.play();
      playing = true;
    }

    starGeo = new THREE.Geometry();
     for(let i=0;i<8000;i++) {
       star = new THREE.Vector3(
         Math.random() * 600 - 300,
         Math.random() * 24 - 12,
         Math.random() * 500 - 250
       );
       star.velocity = 0;
       star.acceleration = 1;
       starGeo.vertices.push(star);
     }
 
     let starMaterial = new THREE.PointsMaterial({
       color: 0xffffff,
       size: 0.7
     });
 
     stars = new THREE.Points(starGeo,starMaterial);
     stars.position.set(0,0,0);
     scene.add(stars);

     window.addEventListener("resize", onWindowResize, false);

     //------------------Renderer------------------
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    let mousePos = { x: 0, y: 0 };
    let counter = -120;
    let numbers = [];
    let numbersx = [];
    let numbersz = [];
    starGeo.vertices.forEach(p => {
      // p.z = -40;
        numbers.push(p.y);
        if (p.x > 0){
          p.x = Math.sqrt(81 - (p.y * p.y));
        }
        else{
          p.x = -(Math.sqrt(81 - (p.y * p.y)));
        }
        numbersx.push(p.x);
        if (numbersz.length % 1000 == 0){
          counter += 10;
        }
        numbersz.push(counter);
      });

//------------------Functions------------------
function onDocumentMouseMove(mouse){
    console.log(mouse.y);
    mx = (event.clientX / window.innerWidth) * 14 - 7;
    my = - (event.clientY / window.innerHeight) * 8 + 4;  
    mousePos = {x:mx, y:my};
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
function animate() {
    console.log(analyser.getAverageFrequency());
      // console.log(analyser.getFrequencyData());
      let number = 0;
      scene.rotation.z += 0.002;
      starGeo.vertices.forEach(p => {
        p.z = numbersz[number];
        if (numbers[number] >= 8){
          p.y = (analyser.getFrequencyData()[0]/16) + numbers[number];
        }
        else if (numbers[number] >= 3 && numbers[number] <= 8){
          if (numbersx[number] > 0){
            p.x = numbersx[number] + ((analyser.getFrequencyData()[1]/16));
            p.y = (analyser.getFrequencyData()[1]/16) + numbers[number];
          }
          else{
            p.x = numbersx[number] - ((analyser.getFrequencyData()[7]/16));
            p.y = (analyser.getFrequencyData()[7]/16) + numbers[number];
          }
        }
        else if (numbers[number] >= -3 && numbers[number] <= 3){
          if (numbersx[number] > 0){
            p.x = numbersx[number] + ((analyser.getFrequencyData()[2]/16));
          }
          else{
            p.x = numbersx[number] - ((analyser.getFrequencyData()[6]/16));
          }
        }
        else if (numbers[number] >= -8 && numbers[number] <= -3){
          if (numbersx[number] > 0){
            p.x = numbersx[number] + ((analyser.getFrequencyData()[3]/16));
            p.y = numbers[number] - (analyser.getFrequencyData()[3]/16);
          }
          else{
            p.x = numbersx[number] - ((analyser.getFrequencyData()[5]/16));
            p.y = numbers[number] - (analyser.getFrequencyData()[5]/16);
          }
        }
        else if (numbers[number] <= -8){
          p.y = numbers[number] - (analyser.getFrequencyData()[4]/16);
        }
        number += 1;
        if (p.z > 200){
          p.z = -200;
        }
      });

  starGeo.verticesNeedUpdate = true;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}


animate();