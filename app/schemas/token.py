from pydantic import BaseModel
from uuid import UUID
from app.db.models.user import UserRole


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: UUID
    role: UserRole