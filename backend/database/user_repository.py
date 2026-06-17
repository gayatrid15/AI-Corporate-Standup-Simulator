from sqlalchemy import text
from database.connection import engine


def get_user_by_email(email):
    query = text("""
        SELECT *
        FROM Users
        WHERE Email = :email
    """)

    with engine.begin() as conn:
        result = conn.execute(
            query,
            {"email": email},
        )

        row = result.fetchone()

        if not row:
            return None

        return dict(row._mapping)


def get_user_by_username(username):
    query = text("""
        SELECT *
        FROM Users
        WHERE Username = :username
    """)

    with engine.begin() as conn:
        result = conn.execute(
            query,
            {"username": username},
        )

        row = result.fetchone()

        if not row:
            return None

        return dict(row._mapping)


def create_user(
    username,
    email,
    password_hash,
    role="Admin",
):
    query = text("""
        INSERT INTO Users (
            Username,
            Email,
            PasswordHash,
            Role
        )
        OUTPUT INSERTED.UserId
        VALUES (
            :username,
            :email,
            :password_hash,
            :role
        )
    """)

    with engine.begin() as conn:
        result = conn.execute(
            query,
            {
                "username": username,
                "email": email,
                "password_hash": password_hash,
                "role": role,
            },
        )

        row = result.fetchone()

        return str(row[0])
