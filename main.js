/*
					Astéroïde 
	A music-based game of dodging wireframe asteroids
	
	By Sam Lynch
*/
console.log('%c** Astéroïde v0.3.0 **', 'background: #FF1493; color: #FFFFFF');
console.log('%c  ** By Sam Lynch **  ', 'background: #FF1493; color: #FFFFFF');

// Initial difficulty
var difficulty = 2;

// pointers to UI
var text2;
var progress;

// This function loads the asteroid object and initializes loading the BGM 
function LoadResources()
{
	var loader = new THREE.TextureLoader();
	var objLoader = new THREE.OBJLoader();
	objLoader.setPath( 'obj/asteroid/' );
	objLoader.load( 'Rock_Reduced.obj', function ( object ) 
	{
		var material = new THREE.MeshBasicMaterial({color: 0xFF00000, wireframe:true});
		object.traverse(function(child) 
		{
			if (child instanceof THREE.Mesh)
			{
				child.material = material;
			}
		});
		object.scale.set(19,19,19);
		object.position.z += 8;
		astrode.asteroidPrefab = object;
		
		astrode.listener = new THREE.AudioListener();
		astrode.music = new THREE.Audio( astrode.listener );
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( 'music/bgm.mp3', function( buffer ) 
		{
			astrode.music.setBuffer( buffer );
			astrode.music.setLoop(false);
			astrode.music.setVolume(0.05);
			astrode.init();
		}, function ( xhr ) { console.log( "%caudioLoader: " + Math.floor(xhr.loaded / xhr.total * 100) + '% loaded', 'color: #0000FF') });
	}, function(){}, function(){} );
}

function onWindowResize() {

	astrode.camera.aspect = window.innerWidth / window.innerHeight;
	astrode.camera.updateProjectionMatrix();

	astrode.renderer.setSize( window.innerWidth, window.innerHeight );
	
	// We need it in radians
	var vFOV = astrode.camera.fov * Math.PI / 180; 
	var height = 2 * Math.tan( vFOV / 2 ) * astrode.camera.position.z; 

	var aspect = window.innerWidth / window.innerHeight;
	astrode.scrWidth = height * aspect;  
	waveform2.mesh.position.x = astrode.scrWidth*0.6;
	waveform.mesh.position.x = -astrode.scrWidth*0.6;
}

// From: http://stackoverflow.com/questions/6198217/moving-object-from-vector-a-to-b-in-2d-environment-with-in-increments-of-percent
function lerp(a, b, t) {
	return (a + t * (b - a));
}

document.addEventListener("DOMContentLoaded", function(event) { 
	LoadResources();
});