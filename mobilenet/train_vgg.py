from tensorflow.python.keras.applications.vgg16 import VGG16
from tensorflow.python.keras.layers import Dense, GlobalAveragePooling2D, Flatten, Dropout, Input
from tensorflow.python.keras.models import Model
from tensorflow.python.keras.optimizers import SGD
from tensorflow.python.keras.preprocessing.image import ImageDataGenerator

batch_size = 32

img_width, img_height = 150, 150

input_tensor = Input(shape=(img_height, img_width, 3))
vgg16_model = VGG16(include_top=False, weights='imagenet',
                    input_tensor=input_tensor)

x = Flatten(input_shape=vgg16_model.output_shape[1:])(vgg16_model.output)
x = Dense(256, activation='relu')(x)
# let's add a fully-connected layer
x = Dropout(0.5)(x)
# and a logistic layer -- let's say we have 200 classes
predictions = Dense(1, activation='sigmoid')(x)

# this is the model we will train
model = Model(inputs=vgg16_model.input, outputs=predictions)

# first: train only the top layers (which were randomly initialized)
# i.e. freeze all convolutional InceptionV3 layers
for layer in vgg16_model.layers:
  layer.trainable = False

model.compile(optimizer=SGD(lr=1e-4, momentum=0.9),
              loss='binary_crossentropy', metrics=['accuracy'])

# let's visualize layer names and layer indices to see how many layers
# we should freeze:
for i, layer in enumerate(vgg16_model.layers):
  print(i, layer.name)

train_datagen = ImageDataGenerator(
    rescale=1.0/255,
    zoom_range=0.2,
    horizontal_flip=True,
    width_shift_range=0.5,
    height_shift_range=0.5,
    rotation_range=90,
)

test_datagen = ImageDataGenerator(rescale=1.0 / 255)

train_generator = train_datagen.flow_from_directory(
    'data/train',
    target_size=(img_width, img_height),
    batch_size=batch_size,
    class_mode='binary'
)

validation_generator = test_datagen.flow_from_directory(
    'data/validation',
    target_size=(img_width, img_height),
    batch_size=batch_size,
    class_mode='binary'
)

model.fit_generator(
    train_generator,
    steps_per_epoch=2000 // batch_size,
    epochs=50,
    validation_data=validation_generator,
    validation_steps=800 // batch_size)

model.save('model/keras.h5')
