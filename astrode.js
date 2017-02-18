var astrode = {};

// Control booleans/variables
astrode.controls = {};
astrode.controls.aButton;
astrode.controls.dButton;
astrode.controls.forward;

astrode.score = 0;

astrode.collisionSFX = new Audio('./sfx/collide.ogg');
astrode.collisionSFX.preload = true;

// Amount of asteroids
const NUM_OF_ASTEROIDS = 25;

// The size of the screen in world space
astrode.scrWidth = 0;

astrode.stopOnslaught = false;

astrode.gameOver = false;

astrode.GameOver = function()
{
	astrode.stopOnslaught = true;
	astrode.gameOver = true;
	document.getElementById("finalScore").innerHTML = text2.innerHTML;
	document.getElementById("inner").style.display = "inline-block";
	text2.style.display = "none";
}

astrode.FlashWaves = function(r,g,b)
{
	if(astrode.gameOver) return;
	waveform.material.color.r = r;
	waveform.material.color.g = g;
	waveform.material.color.b = b;
	waveform2.material.color.r = r;
	waveform2.material.color.g = g;
	waveform2.material.color.b = b;
}

var flashBack = false;

astrode.FlashBackground = function(r,g,b)
{
	if(astrode.gameOver) return;
	astrode.skyBox.material.color.r = r;
	astrode.skyBox.material.color.g = g;
	astrode.skyBox.material.color.b = b;
	astrode.skyBox.material.color.r = r;
	astrode.skyBox.material.color.g = g;
	astrode.skyBox.material.color.b = b;
}

astrode.updateProgress = function(_time)
{
	progress.value = _time;
	
	if(WVFRM.PREV_TIME == Math.floor(_time)) return;
	
	WVFRM.PREV_TIME = Math.floor(_time);
	
	astrode.FlashWaves(Math.random() * difficulty,Math.random() * difficulty,Math.random() * difficulty);
	
	if(flashBack) astrode.FlashBackground((Math.random() * difficulty) * 0.1, (Math.random() * difficulty) * 0.1, (Math.random() * difficulty) * 0.1);
	
	switch(Math.floor(_time))
	{
		case 23:
			difficulty *= 1.4;
			astrode.skyBox.material.color.b = 1.0;
			flashBack = true;
			break;
		case 48:
			difficulty *= 0.5;
			astrode.stopOnslaught = true;
			flashBack = false;
			break;
		case 54:
			astrode.stopOnslaught = false;
			break;
		case 67:
			difficulty *= 1.4;
			astrode.skyBox.material.color.b = 1.0;
			flashBack = true;
			break;
		case 93:
			difficulty *= 0.5;
			astrode.stopOnslaught = true;
			flashBack = false;
			break;
		case 99:
			astrode.stopOnslaught = false;
			break;
		case 110:
			difficulty *= 1.4;
			astrode.skyBox.material.color.b = 1.0;
			flashBack = true;
			break;
		case 134:
			difficulty *= 0.5;
			astrode.stopOnslaught = true;
			flashBack = false;
			break;
		case 140:
			astrode.stopOnslaught = false;
			break;
		case 153:
			difficulty *= 1.4;
			astrode.skyBox.material.color.b = 1.0;
			flashBack = true;
			break;
		case 179:
			difficulty *= 0.5;
			astrode.stopOnslaught = true;
			flashBack = false;
			break;
		case 184:
			astrode.stopOnslaught = false;
			break;
		case 196:
			astrode.stopOnslaught = true;
			break;
		case 200:
			astrode.GameOver();
			break;
	}
}

astrode.init = function()
{
	astrode.renderer = new THREE.WebGLRenderer({ antialias: false });
	astrode.renderer.setClearColor( new THREE.Color(0,0,0) );
	astrode.renderer.setPixelRatio( window.devicePixelRatio );
	astrode.renderer.setSize( window.innerWidth, window.innerHeight );
	
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
	progress.max = 200;
	progress.style.left = "32.5%";
	progress.style.top = 90 + 'px';
	document.body.appendChild(progress);

	astrode.scene = new THREE.Scene();
	
	astrode.clock = new THREE.Clock();
	
	astrode.ASTEROIDS = new Array(NUM_OF_ASTEROIDS);
	for(i = 0; i < NUM_OF_ASTEROIDS; i++)
	{
		astrode.ASTEROIDS[i] = astrode.asteroidPrefab.clone();
		astrode.ASTEROIDS[i].position.x = (-30 * (Math.floor(NUM_OF_ASTEROIDS/2))) + 30 * i;
		astrode.ASTEROIDS[i].position.y = 640 + Math.random() * 500;
		astrode.ASTEROIDS[i].boundingBox = new THREE.Box3().setFromObject(astrode.ASTEROIDS[i]);
		astrode.ASTEROIDS[i].angularVelocity = new THREE.Vector3(Math.random() * 0.01,Math.random() * 0.01,Math.random() * 0.01);
		astrode.ASTEROIDS[i].move = function()
		{
			if(astrode.stopOnslaught == true) return;
			this.position.x = (-30 * (Math.floor(NUM_OF_ASTEROIDS/2))) + 30 * i;
			this.position.y = 700 + (Math.random() * 200 - 100);
			this.inactive = false;
			astrode.ASTEROIDS[i].traverse(function(child) 
			{
				if (child instanceof THREE.Mesh)
				{
					child.visible = true;
				}
			});
		};
		astrode.ASTEROIDS[i].inactive = false;
		astrode.scene.add(astrode.ASTEROIDS[i]);
	}
	
	astrode.skyBox = new THREE.Mesh(new THREE.SphereGeometry(3000, 60, 40), new THREE.MeshBasicMaterial({ color: 0x333333,wireframe:true}));  
	astrode.skyBox.scale.set(-1, 1, 1);  
	astrode.skyBox.rotation.order = 'XZY';  
	astrode.skyBox.renderDepth = 1000.0;  
	astrode.skyBox.name = "Skybox";
	astrode.scene.add(astrode.skyBox);  
	
	var boxtest = new THREE.DodecahedronGeometry( 1, 0 );
	astrode.player = new THREE.Mesh( boxtest, new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true} ) );
	astrode.player.position.x = 0;
	astrode.player.position.y = -110;
	astrode.player.position.z = 0;
	astrode.player.scale.set(12, 12, 12);  
	astrode.player.boundingBox = new THREE.Box3().setFromObject(astrode.player);
	astrode.scene.add(astrode.player);
	
	var container = document.getElementById( 'container' );
	container.appendChild( astrode.renderer.domElement );

	astrode.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
	//camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -500, 10000 );
	astrode.camera.position.x = 5.251351730863566e-13;
	astrode.camera.position.y = -149.19434082065666;
	astrode.camera.position.z = 360.2711060934139;
	astrode.camera.rotation.x = 0.520500576195935;
	astrode.camera.rotation.y = 1.7504505484667145e-15;
	astrode.camera.rotation.z = -1.0034049701963376e-15;
	// Uncomment this to get orbital mouse control
		//controls = new THREE.OrbitControls( astrode.camera, astrode.renderer.domElement );
	
	astrode.camera.add( astrode.listener );

	light = new THREE.AmbientLight( 0x666666 );
	astrode.scene.add( light );
	var directionalLight = new THREE.DirectionalLight( 0xFFFFFF );
	directionalLight.position.x = astrode.camera.position.x;
	directionalLight.position.y = astrode.camera.position.y;
	directionalLight.position.z = astrode.camera.position.z;
	directionalLight.position.normalize();
	astrode.scene.add( directionalLight );

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
	astrode.scene.add(waveform.mesh);
	astrode.scene.add(waveform2.mesh);

	setInterval( function() {

		WVFRM.anal.getByteTimeDomainData(WVFRM.ampArray);
		if (WVFRM.isPlaying == true) {
			WVFRM.updateVertices(waveform,waveform2);
		}
		requestAnimationFrame( astrode.animate );

	}, 1000 / 60 );
	
}

astrode.animate = function() {
	
	astrode.DT = astrode.clock.getDelta();
	
	if(Math.floor(astrode.music.context.currentTime) != WVFRM.PREV_TIME)
	{
		astrode.updateProgress(astrode.music.context.currentTime);
		WVFRM.PREV_TIME = Math.floor(astrode.music.context.currentTime);
	}
	
	if(!astrode.gameOver)
	{
		text2.innerHTML = Math.floor(astrode.score += difficulty * 0.1);
		astrode.skyBox.rotation.x -= difficulty * (0.004 * astrode.DT);
	}
	
	astrode.skyBox.material.color.r = lerp(astrode.skyBox.material.color.r, 0.129411765, astrode.DT * 1.6);
	astrode.skyBox.material.color.g = lerp(astrode.skyBox.material.color.g, 0.129411765, astrode.DT * 1.6);
	astrode.skyBox.material.color.b = lerp(astrode.skyBox.material.color.b, 0.129411765, astrode.DT * 1.6);
	
	waveform.material.color.r = lerp(waveform.material.color.r, 0.19607843137254902, astrode.DT * 1.1);
	waveform.material.color.g = lerp(waveform.material.color.g, 0.19607843137254902, astrode.DT * 1.1);
	waveform.material.color.b = lerp(waveform.material.color.b, 1, astrode.DT * 1.1);
	waveform2.material.color.r = lerp(waveform2.material.color.r, 0.19607843137254902, astrode.DT * 1.1);
	waveform2.material.color.g = lerp(waveform2.material.color.g, 0.19607843137254902, astrode.DT * 1.1);
	waveform2.material.color.b = lerp(waveform2.material.color.b, 1, astrode.DT * 1.1);
	
	astrode.player.rotateX(0.005 * difficulty + (Math.random() * 0.05));
	astrode.player.rotateY(0.005 * difficulty + (Math.random() * 0.05));
	astrode.player.rotateZ(0.005 * difficulty + (Math.random() * 0.05));
	//astrode.player.boundingBox.setFromCenterAndSize(astrode.player.position, new THREE.Vector3( 12, 12, 185 ));
	astrode.player.boundingBox.setFromObject(astrode.player);
	difficulty+= (0.0025);
	if(difficulty > 15) difficulty = 15;
	for(i = 0; i < NUM_OF_ASTEROIDS; i++)
	{
		astrode.ASTEROIDS[i].position.y -= (difficulty);
		if(astrode.ASTEROIDS[i].position.y < -240) 
		{
			astrode.ASTEROIDS[i].move();
		}
		
		astrode.ASTEROIDS[i].rotation.x += astrode.ASTEROIDS[i].angularVelocity.x;
		astrode.ASTEROIDS[i].rotation.y += astrode.ASTEROIDS[i].angularVelocity.y;
		astrode.ASTEROIDS[i].rotation.z += astrode.ASTEROIDS[i].angularVelocity.z;
		
		astrode.ASTEROIDS[i].boundingBox.setFromObject(astrode.ASTEROIDS[i]);
		if(astrode.ASTEROIDS[i].inactive == false && astrode.player.boundingBox.intersectsBox(astrode.ASTEROIDS[i].boundingBox) == true)
		{
			difficulty *= 0.85;
			astrode.ASTEROIDS[i].inactive = true;
			astrode.score -= 250;
			astrode.skyBox.material.color.r = 1.0;
			astrode.skyBox.material.color.g = 0;
			astrode.skyBox.material.color.b = 0;
			console.log("hit!");
			astrode.collisionSFX.play();
			astrode.ASTEROIDS[i].traverse(function(child) 
			{
				if (child instanceof THREE.Mesh)
				{
					child.visible = false;
				}
			});
		};
	}
	
	if(astrode.controls.forward == 1)
	{
		difficulty *= 1.33;
		astrode.controls.forward = 2;
	}
	if(astrode.controls.aButton == true)
	{
		if(astrode.player.position.x > -astrode.scrWidth/2.4)
			astrode.player.position.x -= 450 * astrode.DT;
	}
	if(astrode.controls.dButton == true)
	{
		if(astrode.player.position.x < astrode.scrWidth/2.4)
			astrode.player.position.x += 450 * astrode.DT;
	}

	astrode.renderer.render( astrode.scene, astrode.camera );
}