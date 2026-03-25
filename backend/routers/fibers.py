
from fastapi import APIRouter

from models import Fiber

router = APIRouter(prefix="/fibers")

@router.get('', response_model=list[str])
def get_fibers():
    return [unit.value for unit in Fiber]
