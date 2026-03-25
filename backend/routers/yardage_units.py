
from fastapi import APIRouter

from models import YardageUnit

router = APIRouter(prefix="/yardage-units")

@router.get('', response_model=list[str])
def get_yardage_units():
    return [unit.value for unit in YardageUnit]
