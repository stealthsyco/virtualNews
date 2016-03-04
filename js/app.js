// Set up the keyboard
    var keyboard = new THREEx.KeyboardState();

    // Set up the scene, camera, and renderer as global variables.
    var scene, camera, renderer, animation;
    var video, videoImage, videoImageContext, videoTexture, frame, wallTexture, tag, firstScriptTag;

    var blendMesh, container;

    var cssRenderer, youtubeIframe;

    var Element = function ( id, x, y, z, ry ) {

      var div = document.createElement( 'div' );
      div.style.width = '480px';
      div.style.height = '360px';
      div.style.backgroundColor = '#000';

      var iframe = document.createElement( 'iframe' );
      iframe.style.width = '480px';
      iframe.style.height = '360px';
      iframe.style.border = '0px';
      iframe.src = [ 'http://www.youtube.com/embed/', id, '?rel=0&enablejsapi=1' ].join( '' );
      iframe.id = "youtube-iframe";
      div.appendChild( iframe );

      var object = new THREE.CSS3DObject( div );
      object.position.set( x, y, z );
      object.rotation.y = ry;

      return object;

    };

    init();
    animate();

    // Sets up the scene.
    function init() {

      var container = document.getElementById( 'container' );


      // Create the scene and set the scene size.
      scene = new THREE.Scene();
      var WIDTH = window.innerWidth,
          HEIGHT = window.innerHeight;

      console.log(WIDTH);
      console.log(HEIGHT);

      var windowHalfX = window.innerWidth / 2;
          windowHalfY = window.innerHeight / 2;

      // Create a renderer and add it to the DOM.
      renderer = new THREE.WebGLRenderer({antialias:true});
      renderer.setSize(WIDTH, HEIGHT);
      document.body.appendChild(renderer.domElement);


      // var ambient = new THREE.AmbientLight(0x666666);
      // scene.add(ambient);

      // CAMERA //

      var VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;
      camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
      scene.add(camera);

      camera.position.set(0, 30, 75);

      // Create an event listener that resizes the renderer with the browser window.
      window.addEventListener('resize', function() {
        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
      });

      var sphere = new THREE.SphereGeometry( 0.25, 16, 8 );

      // Set the background color of the scene.
      renderer.setClearColor(0x333F47, 1);

      // Create a light, set its position, and add it to the scene.

      var lightAbove = new THREE.PointLight(0xffffff, .3);
      lightAbove.add( new THREE.Mesh(sphere, new THREE.MeshBasicMaterial ( { color: 0xff0040 } ) ));
      lightAbove.position.set(0,30,0);
      scene.add(lightAbove);

      var lightCenter = new THREE.PointLight(0xffffff, .6);
      lightCenter.add( new THREE.Mesh(sphere, new THREE.MeshBasicMaterial ( { color: 0xff0040 } ) ));
      lightCenter.position.set(0,30,75);
      scene.add(lightCenter);

      var leftLight = new THREE.PointLight(0xffffff, .2);
      leftLight.add( new THREE.Mesh(sphere, new THREE.MeshBasicMaterial ( { color: 0xff0040 } ) ));
      leftLight.position.set(-40,25,35);
      scene.add(leftLight);

      var rightLight = new THREE.PointLight(0xffffff, .2);
      rightLight.add( new THREE.Mesh(sphere, new THREE.MeshBasicMaterial ( { color: 0xff0040 } ) ));
      rightLight.position.set(40,25,35);
      scene.add(rightLight);


      // FLOOR

      var floorTexture = new THREE.ImageUtils.loadTexture( 'models/woodFloor.jpg' );
      floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
      //floorTexture.repeat.set( 10, 10 );
      var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
      var floorGeometry = new THREE.PlaneGeometry(140, 75, 5, 10);
      var floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.position.z = 15;
      //floor.rotation.x = Math.PI / 2;
      floor.rotation.x = Math.PI / 2;
      scene.add(floor);

      // BACK WALL

      var wallTexture = new THREE.ImageUtils.loadTexture( 'images/newsBack.jpg' );
      var wallMaterial = new THREE.MeshBasicMaterial( { map: wallTexture, side: THREE.DoubleSide } );
      var wallGeometry = new THREE.PlaneGeometry(WIDTH/9, HEIGHT/24, 5, 10);
      var wall = new THREE.Mesh(wallGeometry, wallMaterial);
      wall.position.set(0, HEIGHT/48, -18);
      scene.add(wall);

      // GUI
      addGUI();
      // VIDEO STUFF //

      // VIDEO FRAME //

      cssRenderer = new THREE.CSS3DRenderer();
      cssRenderer.setSize( window.innerWidth, window.innerHeight );
      cssRenderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = 0;
      document.body.appendChild( renderer.domElement );

      scene.add(new Element('sGbxmsDFVnE', 9, 8, 0, -.5));

      var loader = new THREE.JSONLoader();
      loader.load( "models/table.json", function(geometry){
        var material = new THREE.MeshLambertMaterial({color: 0x926239});
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, -0.9, 18);
        mesh.scale.x = 3;
        mesh.scale.y = 3;
        mesh.scale.z = 8;
        mesh.rotation.y = Math.PI/2;
        scene.add(mesh);
      });

      var charLoader = new THREE.JSONLoader();

      charLoader.load( "models/animate.js", function(geometry, materials){

      var material = new THREE.MeshLambertMaterial({color: 0xffe0bd});
      mesh = new THREE.SkinnedMesh(geometry, material);
      mesh.position.set(-6, .75, -4);
      mesh.rotation.y = .25;
      scene.add(mesh);

      //THREE.AnimationHandler.add(mesh.geometry.animations);
      //   // animationInit(mesh);
      //animation = new THREE.Animation(mesh, 'ArmatureAction');

      //animation.play();

      });

      // Add OrbitControls so that we can pan around with the mouse.
      controls = new THREE.OrbitControls(camera, renderer.domElement, 0 , 0, 0);

    }

    // Renders the scene and updates the render as needed.
    function animate() {

      //animation.update(.01);
      controls.update();
      keyboardHandler();
      //THREE.AnimationHandler.update(.01);

      // Render the scene.


      renderer.render(scene, camera);
      requestAnimationFrame(animate);


    }

    function keyboardHandler(){
      if ( keyboard.pressed("q") )
        video.play();

      if ( keyboard.pressed("w") )
        video.pause();

      if ( keyboard.pressed("e") ){ // stop video
        video.pause();
        video.currentTime = 0;
        }

      if ( keyboard.pressed("r") ) // rewind video
        video.currentTime = 0;

      if ( keyboard.pressed("a")){

        controls = new THREE.OrbitControls(camera, renderer.domElement, 5, 8, 5);
        camera.position.set(0, 8, 12);

      }

      if( keyboard.pressed("s")) {

        controls = new THREE.OrbitControls(camera, renderer.domElement, -4, 9, 4);
        camera.position.set(0, 10, 15);
      }

      if( keyboard.pressed("d")){

        controls = new THREE.OrbitControls(camera, renderer.domElement, 1, 9, 0);
        camera.position.set(-3, 10, 23);        
      }
    }

    function addGUI(){
    var gui = new dat.GUI();

    gui.add(camera.position, 'x', -500,500).step(.05);
    gui.add(camera.position, 'y', -500,500).step(5);
    gui.add(camera.position, 'z', -50,50).step(5);
    }