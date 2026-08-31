from fastapi import APIRouter
from utils.database import retreats


router = APIRouter()


# =============================
# ADD RETREAT
# =============================

@router.post("/add-retreat")
async def add_retreat(retreat: dict):

    try:

        result = retreats.insert_one(
            retreat
        )

        print(
            "RETREAT INSERTED:",
            result.inserted_id
        )

        return {

            "success": True,

            "message": "Retreat added successfully",

            "id": str(
                result.inserted_id
            )
        }

    except Exception as e:

        print(
            "RETREAT ERROR:",
            e
        )

        return {

            "success": False,

            "message": "Failed to add retreat",

            "error": str(e)
        }


# =============================
# GET ALL RETREATS
# =============================

@router.get("/retreats")
def get_retreats():

    try:

        data = list(
            retreats.find()
        )

        for retreat in data:

            retreat["_id"] = str(
                retreat["_id"]
            )

        return data

    except Exception as e:

        print(
            "GET RETREATS ERROR:",
            e
        )

        return {

            "success": False,

            "message": "Could not fetch retreats"
        }


# =============================
# GET OWNER'S RETREATS
# =============================

@router.get("/my-retreats/{owner_email}")
def get_my_retreats(
    owner_email: str
):

    try:

        data = list(
            retreats.find(
                {
                    "ownerEmail": owner_email
                }
            )
        )

        for retreat in data:

            retreat["_id"] = str(
                retreat["_id"]
            )

        return {

            "success": True,

            "retreats": data
        }

    except Exception as e:

        print(
            "GET MY RETREATS ERROR:",
            e
        )

        return {

            "success": False,

            "message": "Could not fetch your retreats",

            "error": str(e)
        }