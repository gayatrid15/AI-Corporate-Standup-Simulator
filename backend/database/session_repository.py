import json
from sqlalchemy import text

from database.connection import engine


def create_session(
    candidate_name,
    candidate_email,
    candidate_role,
    created_by_user_id=None,
):
    query = text("""
        INSERT INTO Sessions (
            CandidateName,
            CandidateEmail,
            CandidateRole,
            CreatedByUserId
        )
        OUTPUT INSERTED.SessionId
        VALUES (
            :candidate_name,
            :candidate_email,
            :candidate_role,
            :created_by_user_id
        )
    """)
    with engine.begin() as conn:
        result = conn.execute(
            query,
            {
                "candidate_name": candidate_name,
                "candidate_email": candidate_email,
                "candidate_role": candidate_role,
                "created_by_user_id": created_by_user_id,
            },
        )
        row = result.fetchone()

        return str(row[0])


def get_session(session_id):
    query = text("""
        SELECT *
        FROM Sessions
        WHERE SessionId = :session_id
    """)

    with engine.begin() as conn:
        result = conn.execute(
            query,
            {"session_id": session_id},
        )
        row = result.fetchone()
        if not row:
            return None

        return dict(row._mapping)


def validate_candidate(
    session_id,
    candidate_name,
    candidate_email,
):
    query = text("""
        SELECT *
        FROM Sessions
        WHERE SessionId = :session_id
        AND CandidateName = :candidate_name
        AND CandidateEmail = :candidate_email
        AND Status IN ('Pending', 'InProgress')
    """)

    with engine.begin() as conn:
        result = conn.execute(
            query,
            {
                "session_id": session_id,
                "candidate_name": candidate_name,
                "candidate_email": candidate_email,
            },
        )
        row = result.fetchone()
        if not row:
            return None

        return dict(row._mapping)


def mark_session_started(session_id):
    query = text("""
        UPDATE Sessions
        SET
            Status = 'InProgress',
            StartedAt = GETDATE()
        WHERE SessionId = :session_id
    """)
    with engine.begin() as conn:
        conn.execute(
            query,
            {"session_id": session_id},
        )


def mark_session_completed(session_id):
    query = text("""
        UPDATE Sessions
        SET
            Status = 'Completed',
            EndedAt = GETDATE()
        WHERE SessionId = :session_id
    """)
    with engine.begin() as conn:
        conn.execute(
            query,
            {"session_id": session_id},
        )


def save_transcript(
    session_id,
    transcript_json,
):
    query = text("""
        UPDATE Sessions
        SET TranscriptJson = :transcript_json
        WHERE SessionId = :session_id
    """)

    with engine.begin() as conn:
        conn.execute(
            query,
            {
                "session_id": session_id,
                "transcript_json": json.dumps(transcript_json),
            },
        )


def save_report(
    session_id,
    report_json,
):
    query = text("""
        UPDATE Sessions
        SET ReportJson = :report_json
        WHERE SessionId = :session_id
    """)

    with engine.begin() as conn:
        conn.execute(
            query,
            {
                "session_id": session_id,
                "report_json": json.dumps(report_json),
            },
        )


def save_candidate_audio(
    session_id,
    audio_paths,
):
    query = text("""
        UPDATE Sessions
        SET CandidateAudioJson = :audio_json
        WHERE SessionId = :session_id
    """)

    with engine.begin() as conn:
        conn.execute(
            query,
            {
                "session_id": session_id,
                "audio_json": json.dumps(audio_paths),
            },
        )


def save_generated_audio(
    session_id,
    audio_paths,
):
    query = text("""
        UPDATE Sessions
        SET GeneratedAudioJson = :audio_json
        WHERE SessionId = :session_id
    """)

    with engine.begin() as conn:
        conn.execute(
            query,
            {
                "session_id": session_id,
                "audio_json": json.dumps(audio_paths),
            },
        )


def save_pdf_path(
    session_id,
    pdf_path,
):
    query = text("""
        UPDATE Sessions
        SET PdfPath = :pdf_path
        WHERE SessionId = :session_id
    """)

    with engine.begin() as conn:
        conn.execute(
            query,
            {
                "session_id": session_id,
                "pdf_path": pdf_path,
            },
        )


def get_candidate_role(session_id):
    query = text("""
        SELECT CandidateRole
        FROM Sessions
        WHERE SessionId = :session_id
    """)

    with engine.begin() as conn:
        result = conn.execute(
            query,
            {"session_id": session_id},
        )

        row = result.fetchone()

        if not row:
            return None

        return row[0]


def save_interview_results(
    session_id,
    transcript_json,
    report_json,
    pdf_path,
):
    query = text("""
        UPDATE Sessions
        SET
            TranscriptJson = :transcript_json,
            ReportJson = :report_json,
            PdfPath = :pdf_path,
            Status = 'Completed',
            EndedAt = GETDATE()
        WHERE SessionId = :session_id
    """)

    with engine.begin() as conn:
        conn.execute(
            query,
            {
                "session_id": session_id,
                "transcript_json": json.dumps(transcript_json),
                "report_json": json.dumps(report_json),
                "pdf_path": pdf_path,
            },
        )


def get_sessions_by_user(user_id):
    query = text("""
        SELECT
            SessionId,
            CandidateName,
            CandidateEmail,
            CandidateRole,
            Status,
            CreatedAt,
            StartedAt,
            EndedAt,
            PdfPath
        FROM Sessions
        WHERE CreatedByUserId = :user_id
        ORDER BY CreatedAt DESC
    """)

    with engine.begin() as conn:
        result = conn.execute(
            query,
            {"user_id": user_id},
        )

        return [dict(row._mapping) for row in result.fetchall()]
