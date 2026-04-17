# 🔍 Unite – AI Powered Missing Person Tracking & Reunification Platform

Unite is an AI-powered web application designed to help track missing persons and assist in reunification using facial recognition and intelligent multi-attribute matching.

---

## Features

###  Core Functionalities
- Report Missing Person
- Report Found Person
- View Missing Persons Dashboard
- Admin Authentication with OTP
- Case Management System

###  AI Capabilities
- Face recognition using **InsightFace**
- Cosine similarity for facial matching
- Multi-attribute scoring:
  - Age
  - Gender
  - Location (City & State)
  - Clothing description
  - Height
  - Time difference

###  Smart Matching
- Weighted scoring system:
  - 50% Face similarity
  - 50% attribute-based scoring
- Outputs:
  - Very Strong Match
  - Strong Match
  - Moderate Match
  - Low Match

---

##  Tech Stack

### Frontend
- React (TypeScript)
- Tailwind CSS

### Backend
- FastAPI
- Python 3.10

### Database
- SQLite
- SQLAlchemy ORM

### Machine Learning
- InsightFace (Face Embeddings)
- OpenCV
- NumPy

---
