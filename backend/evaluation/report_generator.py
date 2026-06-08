import os

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
)

from reportlab.lib.styles import getSampleStyleSheet


def generate_pdf(
    session_id,
    report,
    transcript,
):

    os.makedirs(
        "reports/generated",
        exist_ok=True,
    )

    pdf_path = f"reports/generated/{session_id}.pdf"

    doc = SimpleDocTemplate(pdf_path)

    styles = getSampleStyleSheet()

    elements = []

    elements.append(
        Paragraph(
            "Candidate Evaluation Report",
            styles["Title"],
        )
    )

    elements.append(Spacer(1, 12))

    elements.append(
        Paragraph(
            f"Overall Score: {report['overall_score']}/100",
            styles["Heading2"],
        )
    )

    metrics = [
        "communication",
        "confidence",
        "technical_reasoning",
        "ownership",
        "problem_solving",
        "professionalism",
    ]

    for metric in metrics:

        elements.append(
            Paragraph(
                f"{metric}: {report[metric]}/10",
                styles["BodyText"],
            )
        )

    elements.append(Spacer(1, 12))

    elements.append(
        Paragraph(
            "Strengths",
            styles["Heading2"],
        )
    )

    for item in report["strengths"]:

        elements.append(
            Paragraph(
                f"• {item}",
                styles["BodyText"],
            )
        )

    elements.append(
        Paragraph(
            "Areas For Improvement",
            styles["Heading2"],
        )
    )

    for item in report["improvements"]:

        elements.append(
            Paragraph(
                f"• {item}",
                styles["BodyText"],
            )
        )

    elements.append(Spacer(1, 12))

    elements.append(
        Paragraph(
            report["summary"],
            styles["BodyText"],
        )
    )

    elements.append(Spacer(1, 20))

    elements.append(
        Paragraph(
            "Transcript",
            styles["Heading2"],
        )
    )

    for line in transcript:

        elements.append(
            Paragraph(
                line,
                styles["BodyText"],
            )
        )

    doc.build(elements)

    return pdf_path
