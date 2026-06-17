import os
from dotenv import load_dotenv

import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

load_dotenv()

BREVO_API_KEY = os.getenv("BREVO_API_KEY")

configuration = sib_api_v3_sdk.Configuration()
configuration.api_key["api-key"] = BREVO_API_KEY


def send_interview_email(
    candidate_name,
    candidate_email,
    interview_link,
):
    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
        sib_api_v3_sdk.ApiClient(configuration)
    )

    template_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "templates",
        "interview_invitation.html",
    )

    with open(
        template_path,
        "r",
        encoding="utf-8",
    ) as file:
        html_content = file.read()

    # Replace with your actual public logo URL
    logo_url = "https://raw.githubusercontent.com/gayatrid15/AI-Corporate-Standup-Simulator/main/frontend/src/assets/logo4.png"

    html_content = (
        html_content.replace(
            "{{candidate_name}}",
            candidate_name,
        )
        .replace(
            "{{candidate_email}}",
            candidate_email,
        )
        .replace(
            "{{interview_link}}",
            interview_link,
        )
        .replace(
            "{{logo_url}}",
            logo_url,
        )
    )

    email = sib_api_v3_sdk.SendSmtpEmail(
        to=[
            {
                "email": candidate_email,
                "name": candidate_name,
            }
        ],
        sender={
            "name": "Arieo | Lexus",
            "email": "arieolexus@gmail.com",
        },
        subject="Interview Invitation",
        html_content=html_content,
    )

    try:
        response = api_instance.send_transac_email(email)

        print(
            "Interview email sent successfully:",
            response,
        )

    except ApiException as e:
        print(
            "Brevo Email Error:",
            e,
        )

    except Exception as e:
        print(
            "Unexpected Email Error:",
            e,
        )
