# Supabase connection helper (server-side, uses service role key)
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL: str = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY: str = os.environ["SUPABASE_SERVICE_ROLE_KEY"]


def get_supabase() -> Client:
    """Return a Supabase client using the service-role key (full DB access)."""
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
