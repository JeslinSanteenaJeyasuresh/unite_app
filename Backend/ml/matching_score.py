import cv2
import numpy as np
import insightface
from datetime import datetime
from difflib import SequenceMatcher


# =====================================================
# LOAD INSIGHTFACE MODEL
# =====================================================

model = insightface.app.FaceAnalysis(name="buffalo_l")
model.prepare(ctx_id=-1)  # CPU


# =====================================================
# FACE RECOGNITION SECTION
# =====================================================

def get_face_embedding(image_path):

    img = cv2.imread(image_path)

    if img is None:
        return None

    faces = model.get(img)

    if len(faces) == 0:
        return None

    return faces[0].embedding


def cosine_similarity(vec1, vec2):

    vec1 = np.array(vec1)
    vec2 = np.array(vec2)

    return np.dot(vec1, vec2) / (
        np.linalg.norm(vec1) * np.linalg.norm(vec2)
    )


# =====================================================
# ATTRIBUTE SCORING SECTION
# =====================================================

def calculate_age_score(age1, age2, date1, date2):
    years_diff = abs((date2 - date1).days) / 365
    expected_age = age1 + years_diff
    diff = abs(expected_age - age2)

    if diff <= 2:
        return 1
    elif diff <= 5:
        return 0.8
    elif diff <= 10:
        return 0.5
    else:
        return 0.2


def calculate_location_score(city1, state1, city2, state2):

    if city1.lower() == city2.lower() and state1.lower() == state2.lower():
        return 1

    if state1.lower() == state2.lower():
        return 0.8

    return 0.4


def calculate_clothing_score(cloth1, cloth2):
    return SequenceMatcher(None, cloth1.lower(), cloth2.lower()).ratio()


def calculate_gender_score(g1, g2):
    return 1 if g1.lower() == g2.lower() else 0


def calculate_height_score(h1, h2):
    diff = abs(h1 - h2)
    if diff <= 3:
        return 1
    elif diff <= 7:
        return 0.7
    else:
        return 0.3


def calculate_time_score(date1, date2):
    diff_days = abs((date2 - date1).days)

    if diff_days <= 7:
        return 1
    elif diff_days <= 30:
        return 0.8
    elif diff_days <= 180:
        return 0.6
    else:
        return 0.3


# =====================================================
# MASTER MATCH FUNCTION
# =====================================================

def compare_missing_with_found(missing_person, found_person):

    # ---------------- FACE SIMILARITY ----------------

    emb_missing = get_face_embedding(missing_person["image_path"])
    emb_found = get_face_embedding(found_person["image_path"])

    if emb_missing is None or emb_found is None:
        return {
        "status": "error",
        "message": "Face not detected in one of the images"
    }
    face_similarity = cosine_similarity(emb_missing, emb_found)
    # Clamp values between 0 and 1
    face_similarity = max(0, min(face_similarity, 1))


    # Normalize to 0–1
    if face_similarity < 0:
        face_similarity = 0

    # ---------------- ATTRIBUTE SCORES ----------------

    age_score = calculate_age_score(
        missing_person["age"],
        found_person["age"],
        missing_person["date"],
        found_person["date"]
    )

    location_score = calculate_location_score(
        missing_person["city"],
        missing_person["state"],
        found_person["city"],
        found_person["state"]
    )

    clothing_score = calculate_clothing_score(
        missing_person["clothing"],
        found_person["clothing"]
    )

    gender_score = calculate_gender_score(
        missing_person["gender"],
        found_person["gender"]
    )

    height_score = calculate_height_score(
        missing_person["height"],
        found_person["height"]
    )

    time_score = calculate_time_score(
        missing_person["date"],
        found_person["date"]
    )

    # ---------------- FINAL WEIGHTED SCORE ----------------

    final_score = (
        0.5 * face_similarity +      # Face gets highest importance
        0.1 * age_score +
        0.1 * location_score +
        0.1 * clothing_score +
        0.1 * gender_score +
        0.05 * height_score +
        0.05 * time_score
    )

    final_percentage = round(final_score * 100, 2)

    # ---------------- DECISION ----------------

    if final_percentage >= 85:
        decision = "Very Strong Match"
    elif final_percentage >= 70:
        decision = "Strong Match"
    elif final_percentage >= 50:
        decision = "Moderate Match"
    else:
        decision = "Low Match"

    return {
    "status": "success",
    "data": {
        "face_similarity_percent": round(face_similarity * 100, 2),
        "final_match_percent": final_percentage,
        "decision": decision
    }
}



# =====================================================
# RANK MULTIPLE FOUND PEOPLE
# =====================================================

def rank_found_people(missing_person, found_people_list):

    results = []

    for found in found_people_list:

        result = compare_missing_with_found(missing_person, found)

        if result["status"] == "error":
            continue

        results.append({
            "name": found["name"],
            "final_score": result["data"]["final_match_percent"],
            "decision": result["data"]["decision"]
        })

    return sorted(results, key=lambda x: x["final_score"], reverse=True)
