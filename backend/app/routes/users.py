from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
import os
import shutil
from pathlib import Path
import uuid
from ..database import get_db
from ..models import User
from ..schemas.schemas import UserResponse, UserUpdate
from ..utils.auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Récupérer les infos du profil utilisateur connecté"""
    return current_user


@router.put("/me", response_model=UserResponse)
def update_me(
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mettre à jour le profil utilisateur connecté"""
    update_dict = data.dict(exclude_unset=True, by_alias=True)
    # Map aliases to model fields
    if 'full_name' in update_dict:
        current_user.name = update_dict['full_name']
    if 'company_name' in update_dict:
        current_user.entreprise_name = update_dict['company_name']
    # Handle direct fields
    for field in ['nif', 'rc_number', 'address', 'phone']:
        if field in update_dict:
            setattr(current_user, field, update_dict[field])
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/me/logo", response_model=UserResponse)
async def upload_logo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload logo for user"""
    # Validate file type
    allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou WEBP."
        )
    
    # Create uploads directory if it doesn't exist
    upload_dir = Path("uploads/logos")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    file_ext = file.filename.split('.')[-1]
    unique_filename = f"{current_user.id}_{uuid.uuid4()}.{file_ext}"
    file_path = upload_dir / unique_filename
    
    # Delete old logo if exists
    if current_user.logo_url:
        old_file_path = Path(current_user.logo_url)
        if old_file_path.exists():
            old_file_path.unlink()
    
    # Save new file
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Update user record with forward slashes for URL
    current_user.logo_url = str(file_path).replace('\\', '/')
    db.commit()
    db.refresh(current_user)
    
    return current_user
