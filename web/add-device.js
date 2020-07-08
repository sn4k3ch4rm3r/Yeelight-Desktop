function addDevice() {
	const name = document.getElementById('name').value;
	const ip = document.getElementById('ip').value;
	eel.add_device(name, ip)(function(success) {
		if (success) {
			location.href = 'dashboard.html';
		}
		else {
			alert('Invalid IP address');
		}
	});
}