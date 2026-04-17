import shutil
from fastapi import APIRouter,Depends, HTTPException, UploadFile, Form, File
from sqlmodel import Session, select
from database import get_session
from pathlib import Path

from models import Brand, Skein

LOGOS_DIR = Path(__file__).resolve().parent.parent / "static" / "brand-logos"
router = APIRouter(prefix="/brands")

@router.get('', response_model=list[Brand])
def get_brands(session: Session = Depends(get_session)):
    return session.exec(select(Brand)).all()

@router.post("", response_model=Brand)
def create_brand(name: str = Form(...), logo: UploadFile | None = File(None), session: Session = Depends(get_session)):
    logo_filename = None
    if logo and logo.filename:
        suffix = Path(logo.filename).suffix
        safe_name = name.lower().replace(" ", "-")
        logo_filename = f"{safe_name}{suffix}"
        with open(LOGOS_DIR / logo_filename, "wb") as f:
            shutil.copyfileobj(logo.file, f)
    brand = Brand(name=name, logo_filename=logo_filename)
    session.add(brand)
    session.commit()
    session.refresh(brand)
    return brand

@router.patch("/{id}", response_model=Brand)
def update_brand(
    id: int,
    name: str | None = Form(None),
    logo: UploadFile | None = File(None),
    session: Session = Depends(get_session),
):
    brand = session.get(Brand, id)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    if name is not None:
        brand.name = name
    if logo and logo.filename:
        suffix = Path(logo.filename).suffix
        safe_name = (name or brand.name).lower().replace(" ", "-")
        logo_filename = f"{safe_name}{suffix}"
        with open(LOGOS_DIR / logo_filename, "wb") as f:
            shutil.copyfileobj(logo.file, f)
        brand.logo_filename = logo_filename
    session.add(brand)
    session.commit()
    session.refresh(brand)
    return brand


@router.delete("/{id}", status_code=204)
def delete_brand(id: int, remove_skeins: bool = False, session: Session = Depends(get_session)):
    brand = session.get(Brand, id)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    if brand.logo_filename:
        logo_path = LOGOS_DIR / brand.logo_filename
        if logo_path.exists():
            logo_path.unlink()
    skeins = session.exec(select(Skein).where(Skein.brand_id == id)).all()
    if remove_skeins:
        for skein in skeins:
            session.delete(skein)
    else:
        for skein in skeins:
            skein.brand_id = None
            session.add(skein)
    session.delete(brand)
    session.commit()

