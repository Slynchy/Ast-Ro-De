

function handleKeyDown(event) 
{
	if (event.keyCode === 65) 
	{ //66 is "b"
		astrode.controls.aButton = true;
	}
	if(event.keyCode === 68)
	{
		astrode.controls.dButton = true;
	}
	if(event.keyCode === 87)
	{   
		if(astrode.controls.forward == 0) astrode.controls.forward = 1;
	}
}

function handleKeyUp(event) {
	if (event.keyCode === 65) 
	{
		astrode.controls.aButton = false;
	}
	if (event.keyCode === 87) 
	{
		if(astrode.controls.forward == 2) difficulty *= 0.77;
		astrode.controls.forward = 0;
	}
	if(event.keyCode === 68)
	{
		astrode.controls.dButton = false;
	}
}

window.addEventListener('keydown', handleKeyDown, false);
window.addEventListener('keyup', handleKeyUp, false);

window.addEventListener('touchstart', function(e){
	if(e.changedTouches[0].pageX < (window.innerWidth * 0.25))
	{
		astrode.controls.aButton = true;
	}
	else if(e.changedTouches[0].pageX > (window.innerWidth * 0.75))
	{
		astrode.controls.dButton = true;
	}
}, false)
window.addEventListener('touchend', function(e){
	astrode.controls.aButton = false;
	astrode.controls.dButton = false;
}, false)

var cursorX, cursorY;
document.onmousemove = function(e){
	cursorX = e.pageX;
	cursorY = e.pageY;
}
window.addEventListener('mousedown', function(e){
	if(cursorX < (window.innerWidth * 0.25))
	{
		astrode.controls.aButton = true;
	}
	else if(cursorX > (window.innerWidth * 0.75))
	{
		astrode.controls.dButton = true;
	}
}, false)
window.addEventListener('mouseup', function(e){
	astrode.controls.aButton = false;
	astrode.controls.dButton = false;
}, false)