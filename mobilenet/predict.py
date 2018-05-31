import cv2
import numpy as np
from keras.models import load_model
from keras.applications import mobilenet

model = load_model('keras.mobilenet.h5',custom_objects={
                   'relu6': mobilenet.relu6,
                   'DepthwiseConv2D': mobilenet.DepthwiseConv2D})
img = cv2.imread('dog.jpg')
img = cv2.resize(img, (150, 150))
x = np.expand_dims(img, axis=0)
x = x / 255.0

ret = model.predict(x)[0]
print(ret)
