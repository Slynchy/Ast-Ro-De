
// Referred alot to https://developer.mozilla.org/en/docs/Web/API/AudioContext


var WVFRM = {};

WVFRM.audioContext = new (window.AudioContext || window.webkitAudioContext)();
WVFRM.audioBuffer;
WVFRM.sourceBuffer;
WVFRM.analyser;
WVFRM.javascriptProcessor;
WVFRM.audioData = 0;
WVFRM.isPlaying = false;
WVFRM.sampleSize = 2048;  // samples to get before analyzing the data
WVFRM.amplitudeArray;     // array to hold time domain data
WVFRM.gain;					// Used to modulate volume
WVFRM.PREV_TIME = 0;

WVFRM.audioUrl = "./music/bgm.mp3";

WVFRM.setup = function() {
	
	// "Creates a ScriptProcessorNode, which can be used for direct audio processing via JavaScript."
	WVFRM.javascriptProcessor = WVFRM.audioContext.createScriptProcessor(WVFRM.sampleSize, 1, 1);
	
	// "Creates an AnalyserNode, which can be used to expose audio time and frequency data and for example to create data visualisations."
	WVFRM.analyser = WVFRM.audioContext.createAnalyser();
	
	// "Creates an AudioBufferSourceNode, which can be used to play and manipulate audio data contained within an AudioBuffer object."
	WVFRM.sourceBuffer = WVFRM.audioContext.createBufferSource();

	// Init the array to house all the frequency info
	WVFRM.amplitudeArray = new Uint8Array(WVFRM.analyser.frequencyBinCount);
	
	// "Creates a GainNode, which can be used to control the overall volume of the audio graph."
	WVFRM.gain = WVFRM.audioContext.createGain();

	// Connect everything together
	WVFRM.sourceBuffer.connect(WVFRM.audioContext.destination);
	WVFRM.sourceBuffer.connect(WVFRM.analyser);
	WVFRM.sourceBuffer.connect(WVFRM.gain);
	WVFRM.gain.connect(WVFRM.audioContext.destination);
	WVFRM.gain.gain.value = -0.6; // Change depending on the music/sound
	WVFRM.analyser.connect(WVFRM.javascriptProcessor);
	WVFRM.javascriptProcessor.connect(WVFRM.audioContext.destination);  
}

WVFRM.playSound = function (buff) {
	WVFRM.sourceBuffer.buffer = buff;
	WVFRM.sourceBuffer.loop = false;
	WVFRM.isPlaying = true;
	WVFRM.sourceBuffer.start(0);
}

// Boilerplate AJAX file loader
WVFRM.loadSound = function(url) {
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "arraybuffer";

	request.onload = function () {
		WVFRM.audioContext.decodeAudioData(request.response, function (buffer) {
			WVFRM.audioData = buffer;
			WVFRM.playSound(WVFRM.audioData);
		}, onError);
	}
	request.send();
}

function onError(e) {
  console.log(e);
}

WVFRM.updateVertices = function() {

  for (var i = 0; i < WVFRM.amplitudeArray.length; i++) {
	var value = WVFRM.amplitudeArray[i] * 2;
	var y = (.01 * value);
		waveform.geom.vertices[i].setX(((5 / WVFRM.amplitudeArray.length) * i) - 2.5);
		waveform.geom.vertices[i].setY(y);
		waveform2.geom.vertices[i].setX(((5 / WVFRM.amplitudeArray.length) * i) - 2.5);
		waveform2.geom.vertices[i].setY(y);
	/*env.waveform.geom.vertices[i].setZ((Math.random()*Math.abs(y))-(Math.abs(y)/2));*/
  }
  waveform.geom.verticesNeedUpdate = true;
  waveform2.geom.verticesNeedUpdate = true;

}

WVFRM.setup();

if(WVFRM.audioData === 0) 
{
	WVFRM.loadSound(WVFRM.audioUrl);
} 
else 
{
	WVFRM.playSound(WVFRM.audioData);
}
