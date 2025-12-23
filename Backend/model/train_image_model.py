import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam
import json
import os

# ========================
# CONFIG
# ========================
DATASET_DIR = "../dataset/chest_xray"
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS = 5
MODEL_SAVE_PATH = "image_model/pneumonia_model.h5"
CLASS_NAMES_PATH = "image_model/class_names.json"

os.makedirs("image_model", exist_ok=True)

# ========================
# DATA GENERATORS
# ========================
train_datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    rotation_range=10,
    zoom_range=0.1,
    width_shift_range=0.05,
    height_shift_range=0.05,
    horizontal_flip=True
)

val_datagen = ImageDataGenerator(rescale=1.0 / 255)

train_generator = train_datagen.flow_from_directory(
    os.path.join(DATASET_DIR, "train"),
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="binary"
)

val_generator = val_datagen.flow_from_directory(
    os.path.join(DATASET_DIR, "val"),
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="binary"
)

# ========================
# MODEL (TRANSFER LEARNING)
# ========================
base_model = ResNet50(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

base_model.trainable = False  # freeze backbone

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation="relu")(x)
x = Dropout(0.3)(x)
output = Dense(1, activation="sigmoid")(x)

model = Model(inputs=base_model.input, outputs=output)

model.compile(
    optimizer=Adam(learning_rate=1e-4),
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# ========================
# TRAIN
# ========================
history = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=EPOCHS
)

# ========================
# SAVE MODEL
# ========================
model.save(MODEL_SAVE_PATH)

# Save class names
class_names = {v: k for k, v in train_generator.class_indices.items()}
with open(CLASS_NAMES_PATH, "w") as f:
    json.dump(class_names, f)

print("✅ Model training complete")
print("✅ Model saved to:", MODEL_SAVE_PATH)
print("✅ Class names saved to:", CLASS_NAMES_PATH)
