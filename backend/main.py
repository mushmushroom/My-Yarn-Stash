from contextlib import asynccontextmanager
from fastapi import FastAPI
from database import create_all_tables
from config import settings
from fastapi.middleware.cors import CORSMiddleware
import logging

from routers import brands, skeins, projects, categories, yardage_units, fibers

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("app.log"),
    ],
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_all_tables()
    yield


app = FastAPI(lifespan=lifespan, docs_url="/documentation", title="Yarn Stash API",)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(skeins.router)
app.include_router(brands.router)
app.include_router(projects.router)
app.include_router(categories.router)
app.include_router(yardage_units.router)
app.include_router(fibers.router)
