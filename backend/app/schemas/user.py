from pydantic import BaseModel, EmailStr, Field, field_validator
from uuid import UUID
from datetime import datetime
from app.db.models.user import UserRole


class UserBase(BaseModel):
    email: EmailStr

    model_config = {
        "extra": "forbid"
    }


class UserCreate(UserBase):
    password: str = Field(..., max_length=128)

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters")
    
        if not any(char.isdigit() for char in value):
            raise ValueError("Password must contain at least one number")

        if not any(char.isupper() for char in value):
            raise ValueError("Password must contain at least one uppercase letter")

        return value

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