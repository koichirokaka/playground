from keras.applications.mobilenet import MobileNet
from keras.layers import Dense, GlobalAveragePooling2D, Reshape, Dropout, Conv2D
from keras.models import Model
from keras.optimizers import SGD
from keras.preprocessing.image import ImageDataGenerator

batch_size = 32

img_width, img_height = 224, 224

mn_model = MobileNet(include_top=False, weights='imagenet')

x = mn_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(1024, activation='relu')(x)
x = Dropout(0.5)(x)
# and a logistic layer -- let's say we have 200 classes
predictions = Dense(1, activation='softmax')(x)

# this is the model we will train
model = Model(inputs=mn_model.input, outputs=predictions)

# first: train only the top layers (which were randomly initialized)
# i.e. freeze all convolutional InceptionV3 layers
for layer in mn_model.layers:
  layer.trainable = False

model.compile(optimizer=SGD(lr=1e-4, momentum=0.9),
              loss='binary_crossentropy', metrics=['accuracy'])

# let's visualize layer names and layer indices to see how many layers
# we should freeze:
for i, layer in enumerate(mn_model.layers):
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

model.save('model/keras.mobilenet.h5')
