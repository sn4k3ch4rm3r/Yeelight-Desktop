import eel
import socket
import yeelight

bulb = yeelight.Bulb('192.168.1.55', duration=500, auto_on=True)

@eel.expose
def toggle():
	bulb.toggle()

@eel.expose
def setBrightness(val):
	bulb.set_brightness(int(val))

@eel.expose
def setColor(r,g,b):
	if r == 0 or g == 0 or b == 0:
		return
	bulb.set_rgb(r,g,b)

@eel.expose
def getState(): 
	resp = bulb.get_properties()
	return(resp)

@eel.expose
def discover():
	return yeelight.discover_bulbs()

eel.init('web')
eel.start('index.html', port=55443, width=200)