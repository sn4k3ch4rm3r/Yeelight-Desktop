var brightness = document.getElementById("brightness-slider");
var power = document.getElementById("power");
var power_status = 'on'
var colorpicker = document.getElementById("colorpicker");
var colorpicker_container = document.getElementById("colorpicker-container");
var colorpicker_marker = document.getElementById("colorpicker-marker");

// eel.discover()(
// 	function(ret) {
// 		console.log(ret);
// 	}
// );


eel.getState()(
	function(ret) {
		// console.log(ret);
		brightness.value = ret.bright;
		power_status = ret.power == 'on'?'off':'on';;
		power.innerHTML = power_status;
		var rgb_hex = parseInt(ret.rgb).toString(16).padStart(6,0);
		setMarker(parseInt(rgb_hex.substring(0,2),16),
				  parseInt(rgb_hex.substring(2,4),16), 
				  parseInt(rgb_hex.substring(4,6),16))
		// console.log(parseInt(rgb_hex.substring(2,4),16));
	}
);

colorpicker_container.addEventListener('click', getCursorPosition, false);
function getCursorPosition(event) {
	var x = event.x;
	var y = event.y;

	x -= colorpicker_container.offsetLeft;
	y -= colorpicker_container.offsetTop;
	
	var ctx = colorpicker.getContext('2d');
	var data = ctx.getImageData(x,y,1,1).data;
	if(data[0] == 0 || data[1] == 0 || data[2] == 0) return;
	setMarker(data[0], data[1], data[2]);
	eel.setColor(data[0], data[1], data[2]);
}

var canvas = document.getElementById('colorpicker');
var ctx = canvas.getContext('2d');
var w = canvas.width;
var h = canvas.height;

function setMarker(r, g, b) {
	colorpicker_marker.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
	r = r/255;
	g = g/255;
	b = b/255;

	let max = Math.max(r,g,b);
	let min = Math.min(r,g,b);
	
	let luminance = Math.round(((min+max)/2)*100);
	let hue;
	if(max == r) {
		hue = (g-b)/(max-min);
	}
	else if (max == g) {
		hue = 2.0+(b-r)/(max-min);
	}
	else {
		hue = 4.0+(r-g)/(max-min);
	}

	hue = Math.round(hue*60);
	if (hue < 0) hue = 360+hue;

	colorpicker_marker.style.top = `${(luminance-50)/(50/h)}px`;
	colorpicker_marker.style.left = `${hue/(360/w)}px`;
}

for (let i = 0; i <= h; i++) {
	for(let j = 0; j <= w; j++) {
		ctx.fillStyle = `hsl(${(360/w)*j}, 100%, ${50+(50/h)*i}%)`;
		ctx.fillRect(j,i,1,1)
	}
}

function toggle() {
	eel.toggle()
	power_status = power_status == 'on'?'off':'on';
	power.innerHTML = power_status;
}

function setBrightness() {
	let val = brightness.value;
	eel.setBrightness(val)
}