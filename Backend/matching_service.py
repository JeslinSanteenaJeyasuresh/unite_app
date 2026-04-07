import numpy as np
from numpy.linalg import norm

def cosine_similarity(a, b):
    return np.dot(a, b) / (norm(a) * norm(b))


def check_match(new_embedding, db_cases):
    for case in db_cases:
        if case.embedding:
            old_embedding = np.array(
                list(map(float, case.embedding.split(",")))
            )
            score = cosine_similarity(new_embedding, old_embedding)

            if score > 0.6:
                return case.case_id

    return None
