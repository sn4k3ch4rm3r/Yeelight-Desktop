import os
import eel
import socket
import sqlite3
import platform
import yeelight

TRANSITION_DURATION = 500

_platform = platform.system()
if _platform == 'Windows':
	path = os.environ['appdata']
elif _platform == 'Linux' or _platform == 'Darwin':
	path = '/etc'
else:
	print('Unsupported OS')
	exit()
db_path = os.path.join(path, 'YeelightController')
os.makedirs(db_path, exist_ok=True)
db_path = os.path.join(db_path, 'lights.db')
db = sqlite3.connect(db_path)
cursor = db.cursor()
cursor.execute('''CREATE TABLE IF NOT EXISTS lights (
					id INTEGER PRIMARY KEY,
					ip TEXT,
					name TEXT,
					model TEXT
				  );''')
@eel.expose
def toggle(ip):
	bulb = yeelight.Bulb(ip, duration=TRANSITION_DURATION)
	bulb.toggle()
	try:
		state = bulb.get_capabilities()['power']
	except:
		state = 'Offline'
	return state

# @eel.expose
# def setBrightness(val):
# 	bulb.set_brightness(int(val))

# @eel.expose
# def setColor(r,g,b):
# 	if r == 0 or g == 0 or b == 0:
# 		return
# 	bulb.set_rgb(r,g,b)

# @eel.expose
# def getState(): 
# 	resp = bulb.get_properties()
# 	return(resp)

# @eel.expose
# def discover():
# 	return yeelight.discover_bulbs()

@eel.expose
def add_device(name, ip):
	sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	sock.settimeout(1)
	try:
		response = sock.connect_ex((ip, 55443))
		if response == 0:
			bulb = yeelight.Bulb(ip, duration=500)
			bulb_info = bulb.get_capabilities()
			if len(name) == 0:
				if len(bulb_info['name']) != 0:
					name = bulb_info['name']
				else:
					name = bulb_info['model']
			bulb.set_name(name)
			cursor.execute('''INSERT INTO lights (
								id, ip, name, model
							)
							VALUES (
								?, ?, ?, ?
							)''', (int(bulb_info['id'][2:], 16), ip, name, bulb_info['model']))
			db.commit()
			print(int(bulb_info['id'][2:], 16), ip, name, bulb_info['model'])
			return True
	except Exception as e:
		print(e)
	return False

@eel.expose
def get_lights():
	cursor.execute('''SELECT * FROM lights;''')
	result = cursor.fetchall()
	lights = []
	for id, ip, name, model in result:
		bulb = yeelight.Bulb(ip)
		try:
			state = bulb.get_capabilities()['power']
		except:
			state = 'Offline'
		lights.append(
			{
				'id':id,
				'ip':ip,
				'name':name,
				'model': model,
				'state': state
			}
		)
	return lights

eel.init('web')
eel.start('dashboard.html', port=55443, width=200)