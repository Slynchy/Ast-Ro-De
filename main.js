// Main ThreeJS variables
var camera, controls, scene, renderer, stats, clock;

// Amount of asteroids
const sizecrid = 25;

// Pointer to skybox
var g_Skybox;

// Player pointer
var player;
var score = 0;

var music;
var listener;

// Initial difficulty
var difficulty = 2;

// Control booleans/variables
var aButton, dButton, forward;

// Prefab for asteroids
var asteroidPrefab;

// Ship prefab
var shipPrefab;

// pointers to UI
var text2;
var progress;
var progressUpdateTimer;

// The size of the screen in world space
var scrWidth;

// Loads the asteroid model
LoadMDL();

// Delta time
var DT = 0.016;

var stopOnslaught = false;

var waveform = {
  	geom: new THREE.Geometry(),
  	material: new THREE.LineBasicMaterial({
      color: 0x0000FF,
	  linejoin: "round",
	  linecap: "square",
	  lights: false
    })
  }
var waveform2 = {
  	geom: new THREE.Geometry(),
  	material: new THREE.LineBasicMaterial({
      color: 0x0000FF,
	  linejoin: "round",
	  linecap: "square",
	  lights: false
    })
  }
waveform.mesh = new THREE.Line( waveform.geom, waveform.material);
waveform2.mesh = new THREE.Line( waveform2.geom, waveform2.material);
for(var a = 0; a < 1024; a++){
	waveform.geom.vertices.push(new THREE.Vector3 ( ( ( 5 / 1024 ) * a ) - 2.5 , 2.5 , 0 ) );
	waveform2.geom.vertices.push( new THREE.Vector3 ( ( ( 5 / 1024 ) * a ) - 2.5, 2.5, 0 ) );
}

function LoadMDL()
{
	var modifer = new THREE.SimplifyModifier();
	var loader = new THREE.TextureLoader();
	loader.load("/asteroid.jpg", function(texture){

		var objLoader = new THREE.OBJLoader();
		objLoader.setPath( 'obj/asteroid/' );
		objLoader.load( 'Rock_Reduced.obj', function ( object ) {
			var material = new THREE.MeshBasicMaterial({color: 0xFF00000, wireframe:true});
			object.traverse(function(child) {
				if (child instanceof THREE.Mesh){
					child.material = material;
				}
			});
			object.scale.set(19,19,19);
			object.position.z += 8;
			asteroidPrefab = object;
			
			
			objLoader.setPath( 'obj/ship/' );
	/*				objLoader.load( 'TIE-fighter.obj', function ( object2 ) 
			{
				material = new THREE.MeshLambertMaterial();
				object2.traverse(function(child) 
				{
					if (child instanceof THREE.Mesh)
					{
						child.material = material;
					}
				});
				shipPrefab = object2;
	*/			
				//loader.load("/test.jpg", function(skyboxTex)
				//{
					var geometry = new THREE.SphereGeometry(3000, 60, 40);  
					//var uniforms = 
					//{  
					//	 texture: { type: 't', value: skyboxTex }
					//};

					var material = new THREE.MeshBasicMaterial( 
					{  
						//uniforms:       uniforms,
						//vertexShader:   document.getElementById('skyvert').textContent,
						//fragmentShader: document.getElementById('skyfrag').textContent,
						color: 0x333333,
						wireframe:true
					});

					skyBox = new THREE.Mesh(geometry, material);  
					skyBox.scale.set(-1, 1, 1);  
					skyBox.rotation.order = 'XZY';  
					skyBox.renderDepth = 1000.0;  
					skyBox.name = "Skybox";
					g_Skybox = skyBox;
					
					listener = new THREE.AudioListener();
					music = new THREE.Audio( listener );
					var audioLoader = new THREE.AudioLoader();
					audioLoader.load( 'music/bgm.mp3', function( buffer ) 
					{
						music.setBuffer( buffer );
						music.setLoop(false);
						music.setVolume(0.05);
						init();
					}, function ( xhr ) {
						console.log( "AudioLoader: " + Math.floor(xhr.loaded / xhr.total * 100) + '% loaded' );
					});
					
				//});
				
			//});
			

		}, function(){}, function(){} );
	});
}

function CubeRejigger()
{
	if(stopOnslaught == true) return;
	this.position.x = (-30 * (Math.floor(sizecrid/2))) + 30 * i;
	this.position.y = 600 + (Math.random() * 200 - 100);
	this.inactive = false;
}

function handleKeyDown(event) 
{
	if (event.keyCode === 65) 
	{ //66 is "b"
		aButton = true;
	}
	if(event.keyCode === 68)
	{
		dButton = true;
	}
	if(event.keyCode === 87)
	{   
		if(forward == 0) forward = 1;
	}
}

function handleKeyUp(event) {
	if (event.keyCode === 65) 
	{
		aButton = false;
	}
	if (event.keyCode === 87) 
	{
		if(forward == 2) difficulty *= 0.77;
		forward = 0;
	}
	if(event.keyCode === 68)
	{
		dButton = false;
	}
}

function updateProgress(_time)
{
	progress.value = _time;
	
	
	if(WVFRM.PREV_TIME == Math.floor(_time)) return;
	
	WVFRM.PREV_TIME = Math.floor(_time);
	
	switch(Math.floor(_time))
	{
		case 23:
			difficulty *= 1.4;
			g_Skybox.material.color.b = 1.0;
			break;
		case 48:
			difficulty *= 0.5;
			stopOnslaught = true;
			break;
		case 54:
			stopOnslaught = false;
			break;
		case 67:
			difficulty *= 1.4;
			g_Skybox.material.color.b = 1.0;
			break;
		case 93:
			difficulty *= 0.5;
			stopOnslaught = true;
			break;
		case 99:
			stopOnslaught = false;
			break;
		case 110:
			difficulty *= 1.4;
			g_Skybox.material.color.b = 1.0;
			break;
	}
}

function init() {

	text2 = document.createElement('p');
	text2.style.position = 'absolute';
	text2.style.width = 300 + 'px';
	text2.style.height = 150 + 'px';
	text2.style.textAlign="center"
	text2.style.fontSize = "xx-large";
	text2.style.marginLeft = "-150px";
	text2.style.marginRight = "-150px";
	text2.style.display = "inline-block";
	text2.style.color = "white";
	text2.innerHTML = "0";
	text2.style.left = "50%";
	text2.style.top = 5 + 'px';
	document.body.appendChild(text2);
	
	progress = document.createElement('progress');
	progress.style.position = 'absolute';
	progress.style.width = "35%";
	progress.style.height = 300;
	progress.value = 0;
	progress.style.textAlign="center";
	progress.max = 203;
	progress.style.left = "32.5%";
	progress.style.top = 90 + 'px';
	document.body.appendChild(progress);

	scene = new THREE.Scene();
	
	stats = new Stats();
	stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild( stats.dom );
	
	clock = new THREE.Clock();
	
	box = new Array(sizecrid);
	for(i = 0; i < sizecrid; i++)
	{
		box[i] = asteroidPrefab.clone();
		box[i].position.x = (-30 * (Math.floor(sizecrid/2))) + 30 * i;
		box[i].position.y = 640 + Math.random() * 500;
		box[i].boundingBox = new THREE.Box3().setFromObject(box[i]);
		box[i].angularVelocity = new THREE.Vector3(Math.random() * 0.01,Math.random() * 0.01,Math.random() * 0.01);
		box[i].move = CubeRejigger;
		box[i].inactive = false;
		scene.add(box[i]);
	}
	
	scene.add(skyBox);  
	
	var boxtest = new THREE.BoxGeometry( 1, 1, 1 );
	player = new THREE.Mesh( boxtest, new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true} ) );//shipPrefab.clone();
	player.position.x = 0;
	player.position.y = -150;
	player.position.z = 0;
	//player.scale.set(0.2, 0.2, 0.2);  
	player.scale.set(12, 12, 12);  
	player.rotation.x = 1.6;
	player.boundingBox = new THREE.Box3().setFromObject(player);
	scene.add(player);

	renderer = new THREE.WebGLRenderer({ antialias: false });
	renderer.setClearColor( new THREE.Color(0.0,0.0,0.0) );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	var container = document.getElementById( 'container' );
	container.appendChild( renderer.domElement );

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
	//camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -500, 10000 );
	//camera = new THREE.OrthographicCamera( (window.innerWidth / - 2), (window.innerWidth / 2), (window.innerHeight / 2), (window.innerHeight / - 2), - 500, 1000 );
	camera.position.x = 5.251351730863566e-13;
	camera.position.y = -149.19434082065666;
	camera.position.z = 360.2711060934139;
	camera.rotation.x = 0.520500576195935;
	camera.rotation.y = 1.7504505484667145e-15;
	camera.rotation.z = -1.0034049701963376e-15;
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	
	camera.add( listener );
	//progressUpdateTimer = setInterval(updateProgress, 1000);
	//music.play();

	//light = new THREE.AmbientLight( 0x666666 );
	//scene.add( light );
	//var directionalLight = new THREE.DirectionalLight( 0xFFFFFF );
	//directionalLight.position.x = camera.position.x;
	//directionalLight.position.y = camera.position.y;
	//directionalLight.position.z = camera.position.z;
	//directionalLight.position.normalize();
	//scene.add( directionalLight );

	window.addEventListener( 'resize', onWindowResize, false );
	onWindowResize();
	
	waveform.mesh.scale.set(390,22,1);
	waveform.mesh.position.y -= 100;
	waveform.mesh.position.z -= 200;
	waveform.mesh.rotation.z = 1.9;
	waveform2.mesh.scale.set(390,22,1);
	waveform2.mesh.position.y -= 100;
	waveform2.mesh.position.z -= 200;
	waveform2.mesh.rotation.z = -1.9;
	scene.add(waveform.mesh);
	scene.add(waveform2.mesh);

	setInterval( function() {

		WVFRM.analyser.getByteTimeDomainData(WVFRM.amplitudeArray);
		if (WVFRM.isPlaying == true) {
			WVFRM.updateVertices();
		}
        requestAnimationFrame( animate );

    }, 1000 / 60 );
	
	//setInterval( 
	//	function() 
	//	{
	//		WVFRM.analyser.getByteTimeDomainData(WVFRM.amplitudeArray);
	//		if (WVFRM.isPlaying == true) {
	//			WVFRM.updateVertices();
	//		}
	//	}
	//, 1000 / 35);
	
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	
	var vFOV = camera.fov * Math.PI / 180;        // convert vertical fov to radians
	var height = 2 * Math.tan( vFOV / 2 ) * camera.position.z; // visible height

	var aspect = window.innerWidth / window.innerHeight;
	scrWidth = height * aspect;                  // visible width
	waveform2.mesh.position.x = scrWidth*0.6;
	waveform.mesh.position.x = -scrWidth*0.6;
}

// From: http://stackoverflow.com/questions/6198217/moving-object-from-vector-a-to-b-in-2d-environment-with-in-increments-of-percent
function lerp(a, b, t) {
	return (a + t * (b - a));
}

function animate() {
	
	DT = clock.getDelta();
    stats.begin();
	
	if(Math.floor(WVFRM.audioContext.currentTime) != WVFRM.PREV_TIME)
	{
		updateProgress(WVFRM.audioContext.currentTime);
		WVFRM.PREV_TIME = Math.floor(WVFRM.audioContext.currentTime);
	}
	
	text2.innerHTML = Math.floor(score += difficulty * 0.1);
	g_Skybox.rotation.x -= difficulty * (0.004 * DT);
	
	g_Skybox.material.color.r = lerp(g_Skybox.material.color.r, 0.129411765, DT * 1.6);
	g_Skybox.material.color.g = lerp(g_Skybox.material.color.g, 0.129411765, DT * 1.6);
	g_Skybox.material.color.b = lerp(g_Skybox.material.color.b, 0.129411765, DT * 1.6);
	
	player.boundingBox.setFromObject(player);
	difficulty+= (0.0025);
	if(difficulty > 15) difficulty = 15;
	for(i = 0; i < sizecrid; i++)
	{
		box[i].position.y -= (difficulty);
		if(box[i].position.y < -240) 
		{
			//box[i].position.y = 240;
			box[i].move();
		}
		
		//box[i].rotateOnAxis(box[i].angularVelocity, 0.1);
		box[i].rotation.x += box[i].angularVelocity.x;
		box[i].rotation.y += box[i].angularVelocity.y;
		box[i].rotation.z += box[i].angularVelocity.z;
		
		//box[i].bboxHelper.update(box[i]);
		
		box[i].boundingBox.setFromObject(box[i]);
		if(box[i].inactive == false && player.boundingBox.intersectsBox(box[i].boundingBox) == true)
		{
			difficulty *= 0.85;
			box[i].inactive = true;
			score -= 250;
			g_Skybox.material.color.r = 1.0;
			g_Skybox.material.color.g = 0;
			g_Skybox.material.color.b = 0;
			console.log("hit!");
		};
	}
	
	if(forward == 1)
	{
		difficulty *= 1.33;
		forward = 2;
	}
	if(aButton == true)
	{
		if(player.position.x > -scrWidth/2.4)
			player.position.x -= 450 * DT;
	}
	if(dButton == true)
	{
		if(player.position.x < scrWidth/2.4)
			player.position.x += 450 * DT;
	}

	render();

    stats.end();
}

function render() {

	renderer.render( scene, camera );
	//composer.render( 0.05 );

}

window.addEventListener('keydown', handleKeyDown, false);
window.addEventListener('keyup', handleKeyUp, false);