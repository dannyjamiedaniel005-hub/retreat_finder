from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from reportlab.pdfgen import canvas

from io import BytesIO


router = APIRouter()


# =============================
# DOWNLOAD PDF TEMPLATE
# =============================

@router.get("/download-template")
def download_template():

    buffer = BytesIO()

    pdf = canvas.Canvas(buffer)

    pdf.setTitle(
        "Retreat Requirements Template"
    )


    # =============================
    # TITLE
    # =============================

    pdf.setFont(
        "Helvetica-Bold",
        18
    )

    pdf.drawString(
        80,
        750,
        "RETREAT REQUIREMENTS"
    )


    # =============================
    # INSTRUCTIONS
    # =============================

    pdf.setFont(
        "Helvetica",
        11
    )

    pdf.drawString(
        80,
        715,
        "Please use the following format"
    )

    pdf.drawString(
        80,
        695,
        "for your retreat requirements."
    )

    pdf.drawString(
        80,
        675,
        "Replace the example values with your own."
    )


    # =============================
    # EXAMPLE
    # =============================

    pdf.setFont(
        "Helvetica-Bold",
        13
    )

    pdf.drawString(
        80,
        635,
        "Example:"
    )


    pdf.setFont(
        "Helvetica",
        12
    )

    pdf.drawString(
        100,
        605,
        "Location: Chennai"
    )

    pdf.drawString(
        100,
        580,
        "People: 30"
    )

    pdf.drawString(
        100,
        555,
        "Budget: 50000"
    )

    pdf.drawString(
        100,
        530,
        "Facilities: Food, Accommodation, Party Hall"
    )

    pdf.drawString(
        100,
        505,
        "Start Date: 2026-10-05"
    )

    pdf.drawString(
        100,
        480,
        "End Date: 2026-10-10"
    )


    # =============================
    # IMPORTANT NOTES
    # =============================

    pdf.setFont(
        "Helvetica-Bold",
        13
    )

    pdf.drawString(
        80,
        435,
        "Important:"
    )


    pdf.setFont(
        "Helvetica",
        11
    )

    pdf.drawString(
        100,
        410,
        "1. Use the exact field names shown above."
    )

    pdf.drawString(
        100,
        385,
        "2. People should be entered as a number."
    )

    pdf.drawString(
        100,
        360,
        "3. Budget should be entered as a number."
    )

    pdf.drawString(
        100,
        335,
        "4. Separate multiple facilities using commas."
    )

    pdf.drawString(
        100,
        310,
        "5. Use dates in YYYY-MM-DD format."
    )


    # =============================
    # SAVE PDF
    # =============================

    pdf.save()

    buffer.seek(0)


    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            "attachment; filename=retreat_requirements_template.pdf"
        }
    )