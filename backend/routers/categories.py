from fastapi import APIRouter

from models import Category

router = APIRouter(prefix="/categories")

@router.get('', response_model=list[str])
def get_categories():
    return [unit.value for unit in Category]
