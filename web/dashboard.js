eel.get_lights()(function(lights) {
	console.log(lights)

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
								<div class="dashboard-power ${light.state}" onclick="toggle(${light.ip})">\
									<span class="material-icons">\
										power_settings_new\
									</span>\
								</div>\
								<hr>`;
			device.className = 'device'
			device.id = light.id
			deviceList.appendChild(device);
		});
	}
	else {
		deviceList.innerHTML = '<div id="no-devices">\
									<p>No devices found.</p>\
								</div>'
	}
});