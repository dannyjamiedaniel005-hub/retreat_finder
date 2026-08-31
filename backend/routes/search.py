from fastapi import APIRouter, UploadFile, File
from pymongo import MongoClient
import fitz
import re

router = APIRouter()


# =============================
# MONGODB
# =============================

client = MongoClient("mongodb://localhost:27017/")
db = client["retreat_db"]
retreats = db["retreats"]


# =============================
# NORMALIZE TEXT
# =============================

def normalize_text(value):

    value = str(value)
    value = value.lower()
    value = value.strip()

    value = re.sub(
        r"\s+",
        " ",
        value
    )

    return value


# =============================
# NORMALIZE FACILITY
# =============================

def normalize_facility(value):

    value = normalize_text(value)

    value = re.sub(
        r"[^a-z0-9 ]",
        "",
        value
    )

    value = re.sub(
        r"\s+",
        " ",
        value
    ).strip()

    if value in [
        "accommodation",
        "accommodations",
        "accomodation",
        "accomodations",
        "stay",
        "staying"
    ]:
        return "accommodation"

    if value in [
        "food",
        "foods",
        "meal",
        "meals"
    ]:
        return "food"

    if value in [
        "yoga",
        "yoga hall",
        "yoga room"
    ]:
        return "yoga"

    if value in [
        "meditation",
        "meditation hall",
        "meditation room"
    ]:
        return "meditation hall"

    if value in [
        "party",
        "party hall",
        "party room"
    ]:
        return "party hall"

    return value


# =============================
# FIND MATCHING RETREATS
# =============================

def find_matching_retreats(
    location,
    people,
    budget,
    facilities,
    start_date,
    end_date
):

    location = normalize_text(location)

    facilities = [
        normalize_facility(item)
        for item in facilities
        if str(item).strip()
    ]

    centers = list(
        retreats.find()
    )

    matches = []

    for center in centers:

        center_name = center.get(
            "name",
            ""
        )

        center_location = normalize_text(
            center.get(
                "location",
                ""
            )
        )

        center_capacity = int(
            center.get(
                "capacity",
                0
            )
        )

        center_price = int(
            center.get(
                "price",
                0
            )
        )

        center_facilities = center.get(
            "facilities",
            []
        )

        available_from = str(
            center.get(
                "availableFrom",
                ""
            )
        )

        available_to = str(
            center.get(
                "availableTo",
                ""
            )
        )


        # =============================
        # LOCATION
        # =============================

        location_ok = (
            center_location == location
        )


        # =============================
        # CAPACITY
        # =============================

        capacity_ok = (
            center_capacity >= people
        )


        # =============================
        # BUDGET
        # =============================

        budget_ok = (
            center_price <= budget
        )


        # =============================
        # FACILITIES
        # =============================

        normalized_center_facilities = [
            normalize_facility(item)
            for item in center_facilities
        ]

        facilities_ok = all(
            required_facility
            in normalized_center_facilities
            for required_facility
            in facilities
        )


        # =============================
        # DATES
        # =============================

        dates_ok = (
            bool(start_date)
            and bool(end_date)
            and bool(available_from)
            and bool(available_to)
            and available_from <= start_date
            and available_to >= end_date
        )


        # =============================
        # FINAL MATCH
        # =============================

        is_match = (
            location_ok
            and capacity_ok
            and budget_ok
            and facilities_ok
            and dates_ok
        )


        # =============================
        # DEBUG
        # =============================

        print("\nCENTER:", center_name)

        print(
            "Location:",
            location_ok
        )

        print(
            "Capacity:",
            capacity_ok
        )

        print(
            "Budget:",
            budget_ok
        )

        print(
            "Facilities:",
            facilities_ok
        )

        print(
            "Dates:",
            dates_ok
        )

        print(
            "MATCH:",
            is_match
        )


        if is_match:

            center["_id"] = str(
                center["_id"]
            )

            matches.append(
                center
            )

    return matches


# =============================
# FIND RETREATS
# FROM TYPED REQUIREMENTS
# =============================

@router.post("/find-retreats")
async def find_retreats(
    requirements: dict
):

    try:

        location = requirements.get(
            "location",
            ""
        )

        people = int(
            requirements.get(
                "people",
                0
            )
        )

        budget = int(
            requirements.get(
                "budget",
                0
            )
        )

        facilities = requirements.get(
            "facilities",
            []
        )

        start_date = requirements.get(
            "startDate",
            ""
        )

        end_date = requirements.get(
            "endDate",
            ""
        )


        # Make sure facilities is a list

        if isinstance(
            facilities,
            str
        ):

            facilities = facilities.split(",")


        matches = find_matching_retreats(
            location,
            people,
            budget,
            facilities,
            start_date,
            end_date
        )


        return {

            "success": True,

            "requirements": {

                "location": location,

                "people": people,

                "budget": budget,

                "facilities": facilities,

                "startDate": start_date,

                "endDate": end_date
            },

            "matches": matches
        }


    except Exception as e:

        import traceback

        print(
            "\nFIND RETREATS ERROR:"
        )

        print(
            str(e)
        )

        traceback.print_exc()

        return {

            "success": False,

            "message": "Could not find retreats",

            "error": str(e)
        }


# =============================
# READ UPLOADED FILE
# =============================

async def read_uploaded_file(file):

    contents = await file.read()


    print(
        "\n============================="
    )

    print(
        "UPLOADED FILE"
    )

    print(
        "============================="
    )

    print(
        "Filename:",
        file.filename
    )

    print(
        "Size:",
        len(contents),
        "bytes"
    )


    if len(contents) == 0:

        raise Exception(
            "Uploaded file is empty"
        )


    # =============================
    # TRY REAL PDF
    # =============================

    try:

        pdf = fitz.open(
            stream=contents,
            filetype="pdf"
        )

        text = ""

        for page in pdf:

            text += page.get_text()

        pdf.close()


        if text.strip():

            print(
                "File detected as REAL PDF"
            )

            return text


    except Exception:

        print(
            "Not a valid PDF."
        )

        print(
            "Trying as plain text..."
        )


    # =============================
    # TRY PLAIN TEXT
    # =============================

    try:

        text = contents.decode(
            "utf-8"
        )

    except UnicodeDecodeError:

        try:

            text = contents.decode(
                "utf-16"
            )

        except UnicodeDecodeError:

            text = contents.decode(
                "latin-1"
            )


    if not text.strip():

        raise Exception(
            "Could not read text from uploaded file"
        )


    print(
        "File detected as PLAIN TEXT"
    )

    return text


# =============================
# UPLOAD REQUIREMENTS PDF
# =============================

@router.post("/upload-requirements")
async def upload_requirements(
    file: UploadFile = File(...)
):

    try:

        text = await read_uploaded_file(
            file
        )


        print(
            "\n============================="
        )

        print(
            "RAW FILE TEXT"
        )

        print(
            "============================="
        )

        print(text)


        # =============================
        # CLEAN TEXT
        # =============================

        text = text.replace(
            "\r",
            "\n"
        )

        text = re.sub(
            r"[ \t]+",
            " ",
            text
        )

        text = re.sub(
            r"\n+",
            "\n",
            text
        )

        text = text.strip()


        # =============================
        # LOCATION
        # =============================

        location_match = re.search(
            r"Location\s*:\s*([^\n]+)",
            text,
            re.IGNORECASE
        )

        location = ""

        if location_match:

            location = (
                location_match
                .group(1)
                .strip()
            )


        # =============================
        # PEOPLE
        # =============================

        people_match = re.search(
            r"(?:People|Number of People)\s*:\s*(\d+)",
            text,
            re.IGNORECASE
        )

        people = 0

        if people_match:

            people = int(
                people_match.group(1)
            )


        # =============================
        # BUDGET
        # =============================

        budget_match = re.search(
            r"Budget\s*:\s*₹?\s*([\d,]+)",
            text,
            re.IGNORECASE
        )

        budget = 0

        if budget_match:

            budget = int(
                budget_match
                .group(1)
                .replace(",", "")
            )


        # =============================
        # FACILITIES
        # =============================

        facilities_match = re.search(
            r"Facilities\s*:\s*([^\n]+)",
            text,
            re.IGNORECASE
        )

        facilities = []

        if facilities_match:

            facility_text = (
                facilities_match
                .group(1)
                .strip()
            )

            facilities = [

                normalize_facility(item)

                for item in facility_text.split(",")

                if item.strip()
            ]


        # =============================
        # START DATE
        # =============================

        start_match = re.search(
            r"Start Date\s*:\s*(\d{4}-\d{2}-\d{2})",
            text,
            re.IGNORECASE
        )

        start_date = ""

        if start_match:

            start_date = (
                start_match
                .group(1)
            )


        # =============================
        # END DATE
        # =============================

        end_match = re.search(
            r"End Date\s*:\s*(\d{4}-\d{2}-\d{2})",
            text,
            re.IGNORECASE
        )

        end_date = ""

        if end_match:

            end_date = (
                end_match
                .group(1)
            )


        # =============================
        # DEBUG
        # =============================

        print(
            "\n============================="
        )

        print(
            "EXTRACTED REQUIREMENTS"
        )

        print(
            "============================="
        )

        print(
            "Location:",
            location
        )

        print(
            "People:",
            people
        )

        print(
            "Budget:",
            budget
        )

        print(
            "Facilities:",
            facilities
        )

        print(
            "Start Date:",
            start_date
        )

        print(
            "End Date:",
            end_date
        )


        # =============================
        # FIND MATCHES
        # =============================

        matches = find_matching_retreats(
            location,
            people,
            budget,
            facilities,
            start_date,
            end_date
        )


        return {

            "success": True,

            "requirements": {

                "location": location,

                "people": people,

                "budget": budget,

                "facilities": facilities,

                "startDate": start_date,

                "endDate": end_date
            },

            "matches": matches
        }


    except Exception as e:

        import traceback

        print(
            "\n============================="
        )

        print(
            "PDF/TEXT ERROR"
        )

        print(
            "============================="
        )

        print(
            str(e)
        )

        traceback.print_exc()


        return {

            "success": False,

            "message": "Could not process file",

            "error": str(e)
        }