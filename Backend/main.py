from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import engine, SessionLocal
import models
from routes import auth_routes, case_routes, dashboard_routes
import os

# Create tables
models.Base.metadata.create_all(bind=engine)

# Ensure uploads folder exists
if not os.path.exists("uploads"):
    os.makedirs("uploads")

app = FastAPI()

# Create default admin if not exists
def create_default_admin():
    db = SessionLocal()
    admin = db.query(models.User).filter(models.User.role == "admin").first()

    if not admin:
        new_admin = models.User(
            name="Admin",
            age=30,
            email="jeslinsanteenajeyasuresh2024@gmail.com",
            mobile="9840132886",
            role="admin",
            is_verified=True
        )
        db.add(new_admin)
        db.commit()
        print("✅ Default admin created")
    else:
        print("ℹ️ Admin already exists")

    db.close()


@app.on_event("startup")
def startup_event():
    create_default_admin()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_routes.router, prefix="/auth")
app.include_router(case_routes.router, prefix="/cases")
app.include_router(dashboard_routes.router, prefix="/dashboard")

# Serve uploaded images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
