from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from datetime import datetime
from app.db.models.user import UserRole


class UserBase(BaseModel):
    email: EmailStr

    model_config = {
        "extra": "forbid"
    }


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)

    model_config = {
        "extra": "forbid"
    }


class UserResponse(UserBase):
    id: UUID
    role: UserRole
    is_active: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }