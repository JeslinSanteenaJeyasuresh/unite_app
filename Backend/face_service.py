import insightface
import numpy as np
import cv2

model = insightface.app.FaceAnalysis(name="buffalo_l")
model.prepare(ctx_id=-1)

def extract_embedding(image_path):
    img = cv2.imread(image_path)
    faces = model.get(img)

    if not faces:
        return None

    return faces[0].embedding
