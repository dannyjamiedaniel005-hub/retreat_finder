import re


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