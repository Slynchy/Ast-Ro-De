// Referred alot to https://developer.mozilla.org/en/docs/Web/API/AudioContext

var WVFRM = {};

// The actual audio context
WVFRM.audCTX = new (window.AudioContext || window.webkitAudioContext)();

WVFRM.srcBuff;

// How many sampples to take?
WVFRM.samples = 2048; 

// The analyser (with a very unfortunate and deliberate abbreviation)
WVFRM.anal;

// The JS processor for the audio 
WVFRM.jsProcessor;

// Variable for raw audio data
WVFRM.audioData = 0;

// Is it playing yet?
WVFRM.isPlaying = false;

// Frequency information array
WVFRM.ampArray;

// Volume control
WVFRM.gain;

WVFRM.PREV_TIME = 0;

WVFRM.musicFile = "./music/bgm.mp3";

WVFRM.setup = function() 
{
	
	// "Creates a ScriptProcessorNode, which can be used for direct audio processing via JavaScript."
	WVFRM.jsProcessor = WVFRM.audCTX.createScriptProcessor(WVFRM.samples, 1, 1);
	
	// "Creates an AnalyserNode, which can be used to expose audio time and frequency data and for example to create data visualisations."
	WVFRM.anal = WVFRM.audCTX.createAnalyser();
	
	// "Creates an AudioBufferSourceNode, which can be used to play and manipulate audio data contained within an AudioBuffer object."
	WVFRM.srcBuff = WVFRM.audCTX.createBufferSource();

	// Init the array that houses all the frequency info
	WVFRM.ampArray = new Uint8Array(WVFRM.anal.frequencyBinCount);
	
	// "Creates a GainNode, which can be used to control the overall volume of the audio graph."
	WVFRM.gain = WVFRM.audCTX.createGain();

	WVFRM.srcBuff.connect(WVFRM.audCTX.destination);
	WVFRM.srcBuff.connect(WVFRM.anal);
	WVFRM.srcBuff.connect(WVFRM.gain);
	WVFRM.gain.connect(WVFRM.audCTX.destination);
	WVFRM.gain.gain.value = -0.6; // Change depending on the music/sound
	WVFRM.anal.connect(WVFRM.jsProcessor);
	WVFRM.jsProcessor.connect(WVFRM.audCTX.destination);  
}

WVFRM.playSound = function (buff) 
{
	WVFRM.srcBuff.buffer = buff;
	WVFRM.srcBuff.loop = false;
	WVFRM.isPlaying = true;
	WVFRM.srcBuff.start(0);
}

// Boilerplate AJAX file loader
WVFRM.loadSound = function(url) 
{
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "arraybuffer";

	request.onload = function () 
	{
		WVFRM.audCTX.decodeAudioData(
			request.response, function (buffer) 
			{
				WVFRM.audioData = buffer;
				WVFRM.playSound(WVFRM.audioData);
			}, 
		onError);
	}
	request.send();
}

function onError(err) {
	console.log( err );
}

WVFRM.updateVertices = function(waveform, waveform2) 
{
	for (var i = 0; i < WVFRM.ampArray.length; i++) 
	{
		var value = WVFRM.ampArray[i] * 2;
		var y = (.01 * value);
		waveform.geom.vertices[i].setX(((5 / WVFRM.ampArray.length) * i) - 2.5);
		waveform.geom.vertices[i].setY(y);
		waveform2.geom.vertices[i].setX(((5 / WVFRM.ampArray.length) * i) - 2.5);
		waveform2.geom.vertices[i].setY(y);
		/*env.waveform.geom.vertices[i].setZ((Math.random()*Math.abs(y))-(Math.abs(y)/2));*/
	}
	waveform.geom.verticesNeedUpdate = true;
	waveform2.geom.verticesNeedUpdate = true;
}

WVFRM.setup();

if(WVFRM.audioData === 0) 
{
	WVFRM.loadSound(WVFRM.musicFile);
} 
else 
{
	WVFRM.playSound(WVFRM.audioData);
}

var waveform = 
{
	geom: new THREE.Geometry(),
	material: new THREE.LineBasicMaterial(
		{
			color: 0x3232FF,
			linejoin: "round",
			linecap: "square",
			lights: false
		}
	)
}

var waveform2 = {
	geom: new THREE.Geometry(),
	material: new THREE.LineBasicMaterial(
		{
		  color: 0x3232FF,
		  linejoin: "round",
		  linecap: "square",
		  lights: false
		}
	)
}

waveform.mesh = new THREE.Line( waveform.geom, waveform.material);
waveform2.mesh = new THREE.Line( waveform2.geom, waveform2.material);

for(var alpha = 0; alpha < 1024; alpha++){
	waveform.geom.vertices.push(
		new THREE.Vector3 ( 
			( ( 5 / 1024 ) * alpha ) - 2.5 , 
			2.5, 
			0 
		) 
	);
	
	waveform2.geom.vertices.push( 
		new THREE.Vector3 ( 
			( ( 5 / 1024 ) * alpha ) - 2.5, 
			2.5, 
			0 
		) 
	);
}