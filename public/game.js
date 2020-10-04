let maxTime = 120;
let musicLoop = [['F', 0], ['D', 50], ['F', 100], ['A', 120]];
let fixed = [];
let rand = [];
let particlesPool = [];
let index = 0;
let badNotes = 0;
capturedScore = 0;
let startButton = document.getElementById( 'startButton' );
let restartButton = document.getElementById( 'restartButton' );
startButton.addEventListener( 'click', init );
restartButton.addEventListener( 'click', restart );
var clock;
var info = document.getElementById( 'info' );
var Colors = {
  black: 0x000000,
  dkpurple: 0x250e56,
  mpurple: 0x653a89,
  ltpurple: 0xb6aff5,
  bright: 0x52b7ff,
  blue: 0x013ba9,
  tan: 0xc7c5b3,
  wrong: 0x92627a,
};
var mousePos = { x: 0, y: 0};
class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(Colors.ltpurple, 100, 950);
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000);
    this.audioLoader = new THREE.AudioLoader();
    let listener = new THREE.AudioListener();
    this.camera.add(listener);
    clock = new THREE.Clock();
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    const geometry = new THREE.BoxGeometry(.8, .8, .8);
    const light = new THREE.DirectionalLight( 0xffffff);
    light.position.set(0, 20, 10);
    const ambient = new THREE.AmbientLight( 0x707070);
    const material = new THREE.MeshPhongMaterial( {color: Colors.dkpurple});
    this.cube = new THREE.Mesh( geometry, material);
    this.cube.name = "Cube";
    this.scene.add(this.cube);
    this.scene.add(light);
    this.scene.add(ambient);
    this.cube.position.y = 100;
    this.cube.position.z = 180;

    this.camera.position.x = 0;
    this.camera.position.z = 200;
    this.camera.position.y = 100;

    // console.log(window.innerHeight);
    this.animate();

  }
  animate() {
    const game = this;
    requestAnimationFrame( function() { game.animate() ; });
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    var targetY = normalize(mousePos.y, -.75, .75, 25, 175);
    var targetX = normalize(mousePos.x, -.75, 75, -100, 100);
    // this.cube.position.y = targetY;
    // this.cube.position.x = targetX;
    if (this.cube.position.y <= 105 && this.cube.position.y >= 95) {
      this.cube.position.y += (targetY-this.cube.position.y) * 0.1;
      // console.log('cube: ' + this.cube.position.y);
    } else if (this.cube.position.y > 105) {
      this.cube.position.y = 105;
    } else {
      this.cube.position.y = 95
    }




    // console.log('Cube: ' + this.cube.position.x + ' ' + this.cube.position.y + ' ' + this.cube.position.z);
    // this.cube.position.x += 1;
    // this.camera.position.x += 1;
    // loop();
    this.renderer.render( this.scene, this.camera);
  }
}



normalize = function(v, vmin, vmax, tmin, tmax) {
  var nv = Math.max(Math.min(v, vmax), vmin);
  var dv = vmax - vmin;
  var pc = (nv - vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}

createSky = function() {
  let sky = new Sky();
  sky.mesh.position.y = -200;
  sky.mesh.name = "sky";
  game.scene.add(sky.mesh);
  return sky.mesh;
}
createSea = function() {
  let sea = new Sea();
  sea.mesh.position.y = -725;
  // sea.mesh.position.z = 150;
  sea.mesh.name = "sea";
  game.scene.add(sea.mesh);

  return sea.mesh;
}

createParticles = function(){
  for (var i=0; i<10; i++){
    var particle = new Particle();
    particlesPool.push(particle);
  }
  particlesHolder = new ParticlesHolder();
  //ennemiesHolder.mesh.position.y = -game.seaRadius;
  game.scene.add(particlesHolder.mesh)
}

createBar = function() {
  let bars = new Bars();
  bars.mesh.position.y = -600;
  bars.mesh.name = "bars";
  game.scene.add(bars.mesh);
  return bars.mesh;
}
Sea = function() {
  let geom = new THREE.SphereBufferGeometry(800, 20, 20);
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  let mat = new THREE.MeshPhongMaterial({
    color: 0x01a9a1 ,
    transparent: true,
    opacity: .6,
    shading: THREE.FlatShading,
  });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.receiveShadow = true;
}

Bars = function() {
  this.mesh = new THREE.Object3D();
  this.nBars = 5;
  let barHeight = 7;
  for (let i = 0; i < this.nBars; i++) {
    let b = new Bar();
    let h = barHeight * i;
    b.mesh.position.y = 690 + h;
    b.mesh.position.x = 0;
    b.mesh.position.z = -175;
    this.mesh.add(b.mesh);
  }
}

Bar = function() {
  let geom = new THREE.CylinderGeometry(300, 300, 2, 40, 10, true);
  let mat = new THREE.MeshPhongMaterial({
    color: Colors.black ,
    transparent: true,
    opacity: .8,
    shading: THREE.FlatShading,
  });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.receiveShadow = true;
}

Sky = function() {
  this.mesh = new THREE.Object3D();
  this.nClouds = 20;
  let stepAngle = Math.PI * 2 / this.nClouds;

  for (let i = 0; i < this.nClouds; i++) {
    let c = new Cloud();
    let a = stepAngle * i;
    let h = 750 + Math.random() * 200;

    c.mesh.position.y = Math.sin(a) * h;
    c.mesh.position.x = Math.cos(a) * h;
    c.mesh.rotation.z = a + Math.PI/2;
    c.mesh.position.z = -400 - Math.random() * 400;
    let s = 1 + Math.random() * 2;
    c.mesh.scale.set(s, s, s);
    this.mesh.add(c.mesh);
  }
}

Cloud = function() {
  this.mesh = new THREE.Object3D();
  let geom = new THREE.BoxGeometry(20,20,20);
  let mat = new THREE.MeshPhongMaterial({
    color: Colors.tan,
  });
  let nBlocs = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < nBlocs; i++) {
    let m = new THREE.Mesh(geom, mat);
    m.position.x = i * 15;
    m.position.y = Math.random() * 10;
    m.position.z = Math.random() * 10;
    m.rotation.z = Math.random() * Math.PI * 2;
    m.rotation.y = Math.random() * Math.PI * 2;

    let s = .1 + Math.random() * .9;
    m.scale.set(s, s, s);
    m.receiveShadow = true;
    this.mesh.add(m);
  }
}


createFixedNotes = function() {
  // let fixedNotes = new FixedNotes();
  this.nNotes = 4;
  let noteSpace = 30;

    for (let i = 0; i < this.nNotes; i++) {
      if (i === 2) {
        game.audioLoader.load( 'Piano17.ogg', function(buffer) {
          let ballGeom = new THREE.SphereBufferGeometry(1.5, 32, 16);

          let mat = new THREE.MeshPhongMaterial({
            color: Colors.tan ,
            transparent: true,
            opacity: .8,
            shading: THREE.FlatShading,
          });
          var audio = new THREE.PositionalAudio( game.camera.children[0] ); // should work but doesnt?
          audio.setBuffer( buffer);
          var ball = new THREE.Mesh(ballGeom, mat);
          // ball.castShadow = true;
          ball.userData.playing = false;
          ball.add(audio);
          fixed.push( ball);

          // let n = new FixedNote();
          // let w = noteSpace * i;
          // this.mesh.position.y = 100;
          ball.position.x = 50 + (30 * i);
          ball.position.y = 102;
          ball.position.z = 175;
          // n.mesh.position.z = -50;
          ball.name = "fixedNotes";
          game.scene.add(ball);
      })
      } else if (i === 3) {
        game.audioLoader.load( 'Piano114.ogg', function(buffer) {
          let ballGeom = new THREE.SphereBufferGeometry(1.5, 32, 16);

          let mat = new THREE.MeshPhongMaterial({
            color: Colors.tan ,
            transparent: true,
            opacity: .8,
            shading: THREE.FlatShading,
          });
          var audio = new THREE.PositionalAudio( game.camera.children[0] ); // should work but doesnt?
          audio.setBuffer( buffer);
          var ball = new THREE.Mesh(ballGeom, mat);
          // ball.castShadow = true;
          ball.userData.playing = false;
          ball.add(audio);
          fixed.push( ball);

          // let n = new FixedNote();
          // let w = noteSpace * i;
          // this.mesh.position.y = 100;
          ball.position.x = 50 + (30 * i);
          ball.position.y = 105;
          ball.position.z = 175;
          // n.mesh.position.z = -50;
          ball.name = "fixedNotes";
          game.scene.add(ball);
      })
      } else {
        game.audioLoader.load( 'Piano14.ogg', function(buffer) {
          let ballGeom = new THREE.SphereBufferGeometry(1.5, 32, 16);

          let mat = new THREE.MeshPhongMaterial({
            color: Colors.tan ,
            transparent: true,
            opacity: .8,
            shading: THREE.FlatShading,
          });
          var audio = new THREE.PositionalAudio( game.camera.children[0] ); // should work but doesnt?
          audio.setBuffer( buffer);
          var ball = new THREE.Mesh(ballGeom, mat);
          // ball.castShadow = true;
          ball.userData.playing = false;
          ball.add(audio);
          fixed.push( ball);

          // let n = new FixedNote();
          // let w = noteSpace * i;
          // this.mesh.position.y = 100;
          ball.position.x = 50 + (30 * i);
          ball.position.y = 100;
          ball.position.z = 175;
          // n.mesh.position.z = -50;
          ball.name = "fixedNotes";
          game.scene.add(ball);
      });
    };
  }
}
createNoteErase = function() {
  let randomY = Math.random * (106 - 96) + 96;

  let geom = new THREE.OctahedronBufferGeometry();
  let mat = new THREE.MeshPhongMaterial({
    color: Colors.bright,
    transparent: true,
    opacity: .7,
        specular:0xffffff,
    shading: THREE.FlatShading,
  })
  var star = new THREE.Mesh(geom, mat);
  star.position.x = 50;
  star.position.y = 100;
  star.position.z = 175;
  star.name = "star";
  console.log('note erase: ' + star.position.x + ' ' + star.position.y + ' ' + star.position.z);
  game.scene.add(star);
}
createRandNote = function() {
  let spacing = Math.random() * 30;
  let randomNote = Math.floor(Math.random() * 4);
  if (randomNote === 1) {
        game.audioLoader.load( 'Piano110.ogg', function(buffer) {
          let ballGeom = new THREE.DodecahedronBufferGeometry(1.5);

          let mat = new THREE.MeshPhongMaterial({
            color: Colors.wrong ,
            transparent: true,
            opacity: .8,
            shading: THREE.FlatShading,
          });
          var audio = new THREE.PositionalAudio( game.camera.children[0] ); // should work but doesnt?
          audio.setBuffer( buffer);
          var ball = new THREE.Mesh(ballGeom, mat);
          ball.castShadow = true;
          ball.userData.playing = false;
          ball.userData.permanent = false;
          ball.add(audio);
          // rand.push( ball);
          ball.position.x = 50;
          ball.position.y = 102;
          ball.position.z = 175;
          // n.mesh.position.z = -50;
          ball.name = "wrongNote";
          game.scene.add(ball);
      })
      } else if (randomNote === 0) {
        game.audioLoader.load( 'Piano125.ogg', function(buffer) {
          let ballGeom = new THREE.DodecahedronBufferGeometry(1.5);

          let mat = new THREE.MeshPhongMaterial({
            color: Colors.wrong ,
            transparent: true,
            opacity: .8,
            shading: THREE.FlatShading,
          });
          var audio = new THREE.PositionalAudio( game.camera.children[0] ); // should work but doesnt?
          audio.setBuffer( buffer);
          var ball = new THREE.Mesh(ballGeom, mat);
          ball.castShadow = true;
          ball.userData.playing = false;
          ball.userData.permanent = false;
          ball.add(audio);
          // rand.push( ball);

          // let n = new FixedNote();
          // let w = noteSpace * i;
          // this.mesh.position.y = 100;
          ball.position.x = 50;
          ball.position.y = 105;
          ball.position.z = 175;
          // n.mesh.position.z = -50;
          ball.name = "wrongNote";
          game.scene.add(ball);
      })
      } else if (randomNote === 2) {
        game.audioLoader.load( 'Piano12.ogg', function(buffer) {
          let ballGeom = new THREE.DodecahedronBufferGeometry(1.5);

          let mat = new THREE.MeshPhongMaterial({
            color: Colors.wrong ,
            transparent: true,
            opacity: .8,
            shading: THREE.FlatShading,
          });
          var audio = new THREE.PositionalAudio( game.camera.children[0] ); // should work but doesnt?
          audio.setBuffer( buffer);
          var ball = new THREE.Mesh(ballGeom, mat);
          ball.castShadow = true;
          ball.userData.playing = false;
          ball.userData.permanent = false;
          ball.add(audio);
          // rand.push( ball);

          // let n = new FixedNote();
          // let w = noteSpace * i;
          // this.mesh.position.y = 100;
          ball.position.x = 50;
          ball.position.y = 95;
          ball.position.z = 175;
          // n.mesh.position.z = -50;
          ball.name = "wrongNote";
          game.scene.add(ball);
      })
      } else if (randomNote === 3) {
        game.audioLoader.load( 'Piano123.ogg', function(buffer) {
          let ballGeom = new THREE.DodecahedronBufferGeometry(1.5);

          let mat = new THREE.MeshPhongMaterial({
            color: Colors.wrong ,
            transparent: true,
            opacity: .8,
            shading: THREE.FlatShading,
          });
          var audio = new THREE.PositionalAudio( game.camera.children[0] ); // should work but doesnt?
          audio.setBuffer( buffer);
          var ball = new THREE.Mesh(ballGeom, mat);
          ball.castShadow = true;
          ball.userData.playing = false;
          ball.userData.permanent = false;
          ball.add(audio);
          // rand.push( ball);

          // let n = new FixedNote();
          // let w = noteSpace * i;
          // this.mesh.position.y = 100;
          ball.position.x = 50;
          ball.position.y = 102;
          ball.position.z = 175;
          // n.mesh.position.z = -50;
          ball.name = "wrongNote";
          game.scene.add(ball);
      })
      } else {
        game.audioLoader.load( 'Piano18.ogg', function(buffer) {
          let ballGeom = new THREE.DodecahedronBufferGeometry(1.5);

          let mat = new THREE.MeshPhongMaterial({
            color: Colors.wrong ,
            transparent: true,
            opacity: .8,
            shading: THREE.FlatShading,
          });
          var audio = new THREE.PositionalAudio( game.camera.children[0] ); // should work but doesnt?
          audio.setBuffer( buffer);
          var ball = new THREE.Mesh(ballGeom, mat);
          ball.castShadow = true;
          ball.userData.playing = false;
          ball.userData.permanent = false;
          ball.add(audio);
          // rand.push( ball);

          // let n = new FixedNote();
          // let w = noteSpace * i;
          // this.mesh.position.y = 100;
          ball.position.x = 50;
          ball.position.y = 98;
          ball.position.z = 175;
          // n.mesh.position.z = -50;
          ball.name = "wrongNote";
          game.scene.add(ball);
      });
  }

}

detectCollision = function(target) {
  // console.log(game.scene.children[0]);
  let diffPosX = game.scene.children[0].position.x - target.position.x;
  let diffPosY = game.scene.children[0].position.y - target.position.y;
  // console.log(diffPosX, diffPosY);
  if (Math.abs(diffPosX) < 2 && Math.abs(diffPosY) < 2) {
    if (target.name === "star") {
      console.log('Power Up!');
      for (let i = 0; i < game.scene.children.length; i++) {
        if (game.scene.children[i].name === "wrongNote" && game.scene.children[i].userData.permanent) {
          game.scene.remove(game.scene.children[i]);
        }
      }
      particlesHolder.spawnParticles(target.position, 7, Colors.bright, 4);
      game.scene.remove(target);
    }
    console.log('Enemy destroyed!');
    particlesHolder.spawnParticles(target.position, 7, Colors.wrong, 4);
    game.scene.remove(target);
  }
}

Particle = function(){
  var geom = new THREE.TetrahedronGeometry(3,0);
  var mat = new THREE.MeshPhongMaterial({
    color:0x009999,
    shininess:0,
    specular:0xffffff,
    shading:THREE.FlatShading
  });
  this.mesh = new THREE.Mesh(geom,mat);
}

Particle.prototype.explode = function(pos, color, scale){
  var _this = this;
  var _p = this.mesh.parent;
  this.mesh.material.color = new THREE.Color( color);
  this.mesh.material.needsUpdate = true;
  this.mesh.scale.set(scale, scale, scale);
  var targetX = pos.x + (-1 + Math.random()*2)*50;
  var targetY = pos.y + (-1 + Math.random()*2)*50;
  var speed = .6+Math.random()*.2;
  TweenMax.to(this.mesh.rotation, speed, {x:Math.random()*12, y:Math.random()*12});
  TweenMax.to(this.mesh.scale, speed, {x:.1, y:.1, z:.1});
  TweenMax.to(this.mesh.position, speed, {x:targetX, y:targetY, delay:Math.random() *.1, ease:Power2.easeOut, onComplete:function(){
      if(_p) _p.remove(_this.mesh);
      _this.mesh.scale.set(1,1,1);
      particlesPool.unshift(_this);
    }});
}

ParticlesHolder = function (){
  this.mesh = new THREE.Object3D();
  this.particlesInUse = [];
}

ParticlesHolder.prototype.spawnParticles = function(pos, density, color, scale){

  var nPArticles = density;
  for (var i=0; i<nPArticles; i++){
    var particle;
    if (particlesPool.length) {
      particle = particlesPool.pop();
    }else{
      particle = new Particle();
    }
    this.mesh.add(particle.mesh);
    particle.mesh.visible = true;
    var _this = this;
    particle.mesh.position.y = pos.y;
    particle.mesh.position.x = pos.x;
    particle.explode(pos,color, scale);
  }
}

randNote = function() {
  var time = clock.getElapsedTime();
  let chance = Math.random();

  if (chance > (0.999 - (.001 * time))) {
    createRandNote();
  }
}

noteErase = function() {

  var time = clock.getElapsedTime();
  let chance = Math.random() * (clock.time - time);
  if (chance > (0.999 - (.0001 * time)) ) {
    createNoteErase();
  }
}

disposeScene = function(parentObject) {
  parentObject.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
        if (node.geometry) {
            node.geometry.dispose();
        }
        if (node.material) {

            if (node.material instanceof THREE.MeshFaceMaterial || node.material instanceof THREE.MultiMaterial) {
                node.material.materials.forEach(function (mtrl, idx) {
                    if (mtrl.map) mtrl.map.dispose();
                    if (mtrl.lightMap) mtrl.lightMap.dispose();
                    if (mtrl.bumpMap) mtrl.bumpMap.dispose();
                    if (mtrl.normalMap) mtrl.normalMap.dispose();
                    if (mtrl.specularMap) mtrl.specularMap.dispose();
                    if (mtrl.envMap) mtrl.envMap.dispose();

                    mtrl.dispose();    // disposes any programs associated with the material
                });
            }
            else {
                if (node.material.map) node.material.map.dispose();
                if (node.material.lightMap) node.material.lightMap.dispose();
                if (node.material.bumpMap) node.material.bumpMap.dispose();
                if (node.material.normalMap) node.material.normalMap.dispose();
                if (node.material.specularMap) node.material.specularMap.dispose();
                if (node.material.envMap) node.material.envMap.dispose();

                node.material.dispose();   // disposes any programs associated with the material
            }
        }
    }
});
}

function loop() {
  var time = clock.getElapsedTime();

  if (badNotes >= 25) {
    if (capturedScore === 0) {
      capturedScore = Math.floor(time/10);
    }
    for (let i = 0; i < game.scene.children.length; i++) {
      if (game.scene.children[i].name === "wrongNote" && game.scene.children[i].userData.permanent === false) {
        game.scene.remove(game.scene.children[i]);
      }
    }
      // disposeScene(game.scene);
      var text = document.getElementById('gamescore');
      text.value = capturedScore;
      // console.log(text.value);
      var gameover = document.getElementById( 'gameover' );
      gameover.style.display = "block";

  }
  if (badNotes < 25) {
    info.innerHTML = '<h1>Score: ' + Math.floor(time/10) + '  ' + 'Bad Notes: ' + badNotes + ' / 25' + '</h1>';
  }

  console.log(badNotes);
  if (index >= 4) {
    index = 0;
  }
  if (time > 20 && badNotes < 25) {
    noteErase();
    randNote();
  }
  for (let i = 0; i < game.scene.children.length; i++){
    //  console.log(game.scene.children[i]);

      if (game.scene.children[i].name === "sea" && badNotes < 25) {
        game.scene.children[i].rotation.z += .005;
      } else if (game.scene.children[i].name === "star" && badNotes < 25) {
        if (game.scene.children[i]) {
          game.scene.children[i].rotation.z += .005;
          game.scene.children[i].position.x -= .3;
          if (game.scene.children[i].position.x < -20) {
            game.scene.remove(game.scene.children[i]);
          }
          detectCollision(game.scene.children[i]);
        }
      } else if (game.scene.children[i].name === "sky" && badNotes < 25) {
        game.scene.children[i].rotation.z += .001;
      } else if (game.scene.children[i].name === "fixedNotes") {

        // console.log('Note: ' + i + ' ' + game.scene.children[i].position.x );
        game.scene.children[i].position.x -= .2;
        if (game.scene.children[i].position.x <= -20 && !game.scene.children[i].userData.playing) {

          game.scene.children[i].userData.playing = true;
          var audio = game.scene.children[i].children[0];
          audio.setLoop(false);
          audio.setVolume( 5);
          audio.play();
          game.scene.children[i].position.x = 30 + (25 * index);
          game.scene.children[i].userData.playing = false;
          index++;

        }
      } else if (game.scene.children[i].name === "wrongNote") {
        // console.log('Note: ' + i + ' ' + game.scene.children[i].position.x );
        game.scene.children[i].position.x -= .2;
        if ( game.scene.children[i] && !game.scene.children[i].userData.permanent ) {
          detectCollision(game.scene.children[i]);
        }

        if (game.scene.children[i]) {
          if (game.scene.children[i].position.x <= -20 && !game.scene.children[i].userData.playing ) {

            game.scene.children[i].userData.playing = true;
            var audio = game.scene.children[i].children[0];
            if (!game.scene.children[i].userData.permanent) {
              badNotes++;
            }

            audio.setLoop(false);
            audio.setVolume( 5);
            audio.play();
            game.scene.children[i].material.color.setHex(0xffff00);
            game.scene.children[i].position.x = 30 + (25 * (index));
            game.scene.children[i].userData.playing = false;
            game.scene.children[i].userData.permanent = true;

          }
        }


    }

    }
  // setTimeout( function() {
    requestAnimationFrame(loop);
    // }, 1000 / 30 );
        game.renderer.render(game.scene, game.camera);
}

function init(event){
  document.addEventListener('mousemove', handleMouseMove, false);
  var overlay = document.getElementById( 'overlay' );
  overlay.remove();

  info.innerHTML = '<h1>Score: </h1>';
  const game = new Game();
  window.game = game;
  let sea = createSea();
  let sky = createSky();
  let bar = createBar();
  let notes = createFixedNotes();
  let particles = createParticles();
  // musicTimer = 0;

  loop();
}

function restart(event) {
  location.reload();
}

var mousePos={x:0, y:0};
handleMouseMove = function(event) {
  var tx = -1 + (event.clientX / innerWidth) * 2;
  var ty = 1 - (event.clientY / innerHeight) * 2;
  mousePos = {x: tx, y: ty};
}

// window.addEventListener('load', init, false);