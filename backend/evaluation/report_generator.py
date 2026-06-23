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

    elements.append(
        Paragraph(
            f"Participation Status: {report.get('participation_status', 'Unknown')}",
            styles["BodyText"],
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
                f"{metric.replace('_', ' ').title()}: {report.get(metric, 0)}/10",
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

    for item in report.get("strengths", []):

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

    for item in report.get("improvements", []):

        elements.append(
            Paragraph(
                f"• {item}",
                styles["BodyText"],
            )
        )

    elements.append(
        Paragraph(
            "Evaluation Flags",
            styles["Heading2"],
        )
    )

    for flag in report.get(
        "evaluation_flags",
        [],
    ):
        elements.append(
            Paragraph(
                f"• {flag}",
                styles["BodyText"],
            )
        )

    elements.append(Spacer(1, 12))

    elements.append(
        Paragraph(
            report.get("summary", "No summary available."),
            styles["BodyText"],
        )
    )

    elements.append(Spacer(1, 20))

    if report.get("answer_evaluations"):

        elements.append(
            Paragraph(
                "Answer Evaluations",
                styles["Heading2"],
            )
        )

        for evaluation in report["answer_evaluations"]:

            elements.append(
                Paragraph(
                    f"Question: {evaluation.get('question', '')}",
                    styles["BodyText"],
                )
            )

            elements.append(
                Paragraph(
                    f"Answer: {evaluation.get('answer', '')}",
                    styles["BodyText"],
                )
            )

            elements.append(
                Paragraph(
                    f"Score: {evaluation.get('score', 0)}/10",
                    styles["BodyText"],
                )
            )

            elements.append(
                Paragraph(
                    f"Feedback: {evaluation.get('feedback', '')}",
                    styles["BodyText"],
                )
            )

            elements.append(Spacer(1, 8))

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
