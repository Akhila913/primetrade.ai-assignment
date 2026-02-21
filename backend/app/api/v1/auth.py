from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import LoginRequest, TokenResponse
from app.db.models.user import User, UserRole
from app.core.security import hash_password, verify_password, create_access_token
from app.api.deps import get_db
import logging


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    new_user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=UserRole.user,
    )

    db.add(new_user)
    db.commit()
    logger.info(
        "User registered",
        extra={"email": payload.email}
    )
    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=TokenResponse)
def login_user(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user:
        logger.warning(
            "Login failed: user not found",
            extra={"email": payload.email},
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(payload.password, user.password_hash):
        logger.warning(
            "Login failed: invalid password",
            extra={
                "user_id": str(user.id),
                "email": user.email,
            },
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(user.id, user.role.value)

    logger.info(
        "Login successful",
        extra={
            "user_id": str(user.id),
            "role": user.role.value,
        },
    )

    return TokenResponse(access_token=access_token)