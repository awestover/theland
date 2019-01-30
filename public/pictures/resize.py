# change to new size
from PIL import Image
import os
# import sys

# https://stackoverflow.com/questions/273946/how-do-i-resize-an-image-using-pil-and-maintain-its-aspect-ratio

newSize=(66,50)

# inPlace (should it just overwrite the old file?)
def imgResize(imgPath, newSize, save=True, inPlace=False):
    img = Image.open(imgPath)
    img = img.resize(newSize, Image.ANTIALIAS)
    if save:
        if inPlace:
            img.save(imgPath)
        else:
            img.save(os.path.join("batch", imgPath))
    else:
        return img

if __name__ == "__main__":
    for i in range(0, 2):
        for j in range(1,5):
            rn = "crab{}-{}.png".format(i, j)
            imgResize(rn, newSize, save=True, inPlace=True)
