eel.get_lights()(function(lights) {
	console.log(lights)

	var deviceList = document.getElementById('device-list');
	if (lights.length > 0) {
		lights.forEach(light => {
			var device = document.createElement('div');
			device.innerHTML = `<h2 class="name" onclick="location.href = 'control.html?${light.id}'">\
									${light.name}\
								</h2>\
								<p "is-on">\
									${light.state}\
								</p>\
								<div class="dashboard-power ${light.state}" onclick="toggle(${light.id}, '${light.ip}')">\
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

function toggle(id, ip) {
	eel.toggle(ip)(function(response) {
		const light = document.getElementById(id);
		const children = light.childNodes;
		console.log(children[4].className);
		children[2].replaceChild(document.createTextNode(response), children[2].childNodes[0]);
		children[4].className = `dashboard-power ${response}`;
	});
}