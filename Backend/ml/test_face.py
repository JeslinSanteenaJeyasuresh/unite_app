from datetime import datetime
from matching_score import rank_found_people
# ===============================
# MISSING PERSON DATA
# ===============================

missing_person = {
    "image_path": "backend/ml/test/missing.jpeg",   # <-- put your image here
    "age": 19,
    "city": "chennai",
    "state": "tamil nadu",
    "clothing": "blue top",
    "gender": "female",
    "height": 165,
    "date": datetime(2024, 1, 12)
}

# ===============================
# FOUND PEOPLE DATA (MULTIPLE)
# ===============================

found_people = [
    {
        "name": "Found Person 1",
        "image_path": "backend/ml/test/found1.jpeg",
        "age": 19,
        "city": "chennai",
        "state": "tamil nadu",
        "clothing": "blue top",
        "gender": "female",
        "height": 165,
        "date": datetime(2024, 1, 12)
    },
    {
        "name": "Found Person 2",
        "image_path": "backend/ml/test/found2.jpeg",
        "age": 19,
        "city": "Chennai",
        "state": "tamil nadu",
        "clothing": "red top",
        "gender": "female",
        "height": 160,
        "date": datetime(2024, 1, 15)
    }
    ,
    {
        "name": "Found Person 3",
        "image_path": "backend/ml/test/found3.jpeg",
        "age": 19,
        "city": "trivandrum",
        "state": "kerala",
        "clothing": "red top",
        "gender": "male",
        "height": 170,
        "date": datetime(2024, 1, 15)
    }
]

# ===============================
# RUN MATCHING
# ===============================

results = rank_found_people(missing_person, found_people)

print("\n===== MATCH RESULTS =====")
for r in results:
    print(r)
