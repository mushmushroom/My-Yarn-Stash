from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from sqlalchemy import func
from database import get_session
import webcolors

from models import Brand, ProjectSkeinLink, SkeinCreate, Skein, SkeinRead, SkeinUpdate, SkeinSuggestion

COLOR_CANDIDATES = frozenset({
    'black', 'white', 'gray', 'red', 'orange', 'yellow',
    'green', 'teal', 'blue', 'navy', 'purple', 'pink',
    'brown', 'beige', 'gold', 'coral', 'lavender',
})

_COLOR_RGB_CACHE: dict[str, tuple[int, int, int]] = {
    name: webcolors.hex_to_rgb(webcolors.name_to_hex(name))
    for name in COLOR_CANDIDATES
}

def closest_color_name(hex_color: str) -> str:
    try:
        name = webcolors.hex_to_name(hex_color)
        if name in COLOR_CANDIDATES:
            return name
    except ValueError:
        pass
    rgb = webcolors.hex_to_rgb(hex_color)
    min_dist = float('inf')
    closest = 'black'
    for name, c in _COLOR_RGB_CACHE.items():
        dist = (rgb[0] - c[0]) ** 2 + (rgb[1] - c[1]) ** 2 + (rgb[2] - c[2]) ** 2
        if dist < min_dist:
            min_dist = dist
            closest = name
    return closest

router = APIRouter(prefix="/skeins")

@router.get('/names', response_model=list[SkeinSuggestion])
def get_skein_names(session: Session = Depends(get_session)):
    skeins = session.exec(select(Skein)).all()
    seen: set[str] = set()
    result = []
    for skein in skeins:
        if skein.name not in seen:
            seen.add(skein.name)
            result.append(SkeinSuggestion(name=skein.name, yardage=skein.yardage, yardage_unit=skein.yardage_unit, fibers = skein.fibers))
    return result

@router.get('', response_model=dict[str, dict[str, list[SkeinRead]]])
def get_skeins(session: Session = Depends(get_session), brand: list[str] | None = Query(default=None), skip_reserved: bool = False, colors: list[str] | None = Query(default=None), fibers: list[str] | None = Query(default=None)):
    stmt = select(Skein).outerjoin(Brand, Skein.brand_id == Brand.id)
    if brand:
        stmt = stmt.where(Brand.name.in_(brand))
    skeins = session.exec(stmt).all()

    used_weight: dict[int, int] = {}
    if skip_reserved:
        for link in session.exec(select(ProjectSkeinLink)).all():
            used_weight[link.skein_id] = used_weight.get(link.skein_id, 0) + link.weight_required

    grouped: dict[str, dict[str, list[Skein]]] = {}
    for skein in skeins:
        skein_brand = skein.brand.name if skein.brand else ""
        if fibers and not any(item in fibers for item in (skein.fibers or [])):
            continue
        if skip_reserved and skein.weight - used_weight.get(skein.id, 0) <= 0:
            continue
        if colors and closest_color_name(skein.color) not in colors:
            continue
        grouped.setdefault(skein_brand, {}).setdefault(skein.name, []).append(skein)
    return grouped

@router.post("", response_model=SkeinRead)
def create_skein(skein: SkeinCreate, session: Session = Depends(get_session)):
    duplicate = session.exec(
        select(Skein).where(
            Skein.name == skein.name,
            Skein.brand_id == skein.brand_id,
            Skein.color == skein.color,
        )
    ).first()
    if duplicate:
        raise HTTPException(status_code=409, detail="A skein with this name, brand and color already exists")

    skein = Skein.model_validate(skein)
    session.add(skein)
    session.commit()
    session.refresh(skein)
    return skein

@router.patch("/{id}", response_model=SkeinRead)
def update_skein(id: int, skein_update: SkeinUpdate, session: Session = Depends(get_session)):
    skein = session.get(Skein, id)
    if not skein:
        raise HTTPException(status_code=404, detail="Skein not found")
    skein.sqlmodel_update(skein_update.model_dump(exclude_unset=True))
    session.add(skein)
    session.commit()
    session.refresh(skein)
    return skein


@router.delete("/{id}", status_code=204)
def delete_skein(id: int, session: Session = Depends(get_session)):
    skein = session.get(Skein, id)
    if not skein:
        raise HTTPException(status_code=404, detail="Skein not found")
    session.delete(skein)
    session.commit()

