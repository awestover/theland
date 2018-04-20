# converts white to transparent backgruond
from PIL import Image
import os

from os.path import join

def imgTransparent(imgPath):

	img = Image.open(imgPath)
	img = img.convert("RGBA")
	datas = img.getdata()

	newData = []
	for item in datas:
		if item[0] == 255 and item[1] == 255 and item[2] == 255:
			newData.append((255, 255, 255, 0))
		else:
			newData.append(item)

	img.putdata(newData)

	img.save(join("batch","{}").format(imgPath), "PNG")

os.mkdir("batch")
for file in os.listdir():
	if ".png" in file:
		imgTransparent(file)



