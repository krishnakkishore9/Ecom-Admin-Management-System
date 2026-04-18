# Auth dependency — validates the Supabase JWT sent by the frontend
import os
from fastapi import Header, HTTPException, status
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL: str = os.environ["SUPABASE_URL"]
SUPABASE_ANON_KEY: str = os.environ["SUPABASE_ANON_KEY"]


async def get_current_user(authorization: str = Header(...)):
    """
    Expects: Authorization: Bearer <supabase_access_token>
    Validates the token against Supabase and returns the user object.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format",
        )
    token = authorization.split(" ", 1)[1]

    # Create a per-request client with the user's JWT
    client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    try:
        response = client.auth.get_user(token)
        if not response.user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        return response.user
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
