lights = [
	{
		'state': 'on',
		'name' : 'Yeelight Lightstrip',
	},
	// {
	// 	'state': 'off',
	// 	'name' : 'Bedside strip',
	// }
]
var deviceList = document.getElementById('device-list');
if (lights.length > 0) {
	lights.forEach(light => {
		var device = document.createElement('div');
		device.innerHTML = `<h2 class="name">\
								${light.name}\
							</h2>\
							<p "is-on">\
								${light.state}\
							</p>\
							<div class="dashboard-power ${light.state}">\
								<span class="material-icons">\
									power_settings_new\
								</span>\
							</div>\
							<hr>`;
		device.className = 'device'
		deviceList.appendChild(device);
	});
}
else {
	deviceList.innerHTML = '<div id="no-devices">\
								<p>No devices found.</p>\
							</div>'
}