from fastapi import APIRouter

from utils.database import users


router = APIRouter()


# =============================
# REGISTER
# =============================

@router.post("/register")
async def register(user: dict):

    try:

        existing_user = users.find_one({
            "email": user.get("email")
        })

        if existing_user:

            return {
                "success": False,
                "message": "Email already registered"
            }

        result = users.insert_one(user)

        return {
            "success": True,
            "message": "Registration successful",
            "id": str(result.inserted_id)
        }

    except Exception as e:

        print("REGISTER ERROR:", e)

        return {
            "success": False,
            "message": "Registration failed",
            "error": str(e)
        }


# =============================
# LOGIN
# =============================

@router.post("/login")
async def login(user: dict):

    try:

        found_user = users.find_one({
            "email": user.get("email"),
            "password": user.get("password"),
            "role": user.get("role")
        })

        if not found_user:

            return {
                "success": False,
                "message": "Invalid email or password"
            }

        return {
            "success": True,
            "message": "Login successful",

            "user": {
                "id": str(found_user["_id"]),
                "name": found_user.get("name", ""),
                "email": found_user.get("email", ""),
                "role": found_user.get("role", ""),
                "phone": found_user.get("phone", "")
            }
        }

    except Exception as e:

        print("LOGIN ERROR:", e)

        return {
            "success": False,
            "message": "Login failed",
            "error": str(e)
        }