from fastapi import APIRouter,Depends, HTTPException
from sqlmodel import Session, select
from database import get_session

from models import Brand, BrandCreate

router = APIRouter(prefix="/brands")

@router.get('', response_model=list[Brand])
def get_brands(session: Session = Depends(get_session)):
    return session.exec(select(Brand)).all()

@router.post("", response_model=Brand)
def create_brand(brand: BrandCreate, session: Session = Depends(get_session)):
    brand = Brand.model_validate(brand)
    session.add(brand)
    session.commit()
    session.refresh(brand)
    return brand

@router.delete("/{id}", status_code=204)
def delete_brand(id: int, session: Session = Depends(get_session)):
    brand = session.get(Brand, id)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    session.delete(brand)
    session.commit()

