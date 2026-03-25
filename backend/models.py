from enum import Enum
from sqlalchemy import Column, Enum as SAEnum, JSON
from sqlmodel import SQLModel, Field, Relationship

'''
=========================================
Enums
=========================================
'''
class YardageUnit(str, Enum):
  g25 = "25g"
  g50 = "50g"
  g100 = "100g"


class Category(str, Enum):
  sweaters = "Sweaters"
  summer_tops = "Summer Tops"
  accessories = "Accessories"

'''
=========================================
Contents
=========================================
'''
class Fiber(str, Enum):
  merino = 'merino wool'
  wool = 'wool'
  alpaca = 'alpaca'
  cashmere = 'cashmere'
  mohair = 'mohair'
  angora = 'angora'
  cotton = 'cotton'
  linen = 'linen'
  bamboo = 'bamboo'
  acrylic = 'acrylic'
  polyester = 'polyester'
  nylon = 'nylon'
  elastane = 'elastane'
  viscose = 'viscose'

'''
=========================================
Brand
=========================================
'''
class BrandCreate(SQLModel):
  name: str


# TABLE
class Brand(BrandCreate, table=True):
  id: int | None = Field(default=None, primary_key=True)
  skeins: list["Skein"] = Relationship(back_populates="brand")


'''
=========================================
ProjectSkeinLink
=========================================
'''
# TABLE
# Many-to-many link table
class ProjectSkeinLink(SQLModel, table=True):
  project_id: int | None = Field(default=None, foreign_key="project.id", primary_key=True)
  skein_id: int | None = Field(default=None, foreign_key="skein.id", primary_key=True)
  weight_required: int = 0


'''
=========================================
Skeins
=========================================
'''
class SkeinCreate(SQLModel):
  name: str
  brand_id: int
  color: str
  weight: int
  yardage: str
  yardage_unit: YardageUnit
  fibers: list[Fiber] | None = None
  comment: str | None = None


class SkeinRead(SkeinCreate):
  id: int
  brand: Brand


class SkeinUpdate(SQLModel):
  name: str | None = None
  brand_id: int | None = None
  color: str | None = None
  weight: int | None = None
  yardage: str | None = None
  yardage_unit: YardageUnit | None = None
  fibers: list[Fiber] | None = None
  comment: str | None = None


class SkeinSuggestion(SQLModel):
  name: str
  yardage: str
  yardage_unit: YardageUnit
  fibers: list[Fiber] | None = None


# TABLE
class Skein(SkeinCreate, table=True):
  id: int | None = Field(default=None, primary_key=True)
  brand_id: int = Field(foreign_key="brand.id")
  brand: Brand | None = Relationship(back_populates="skeins")
  yardage_unit: YardageUnit = Field(
    sa_column=Column(SAEnum(YardageUnit, values_callable=lambda x: [e.value for e in x]))
  )
  fibers: list[Fiber] | None = Field(default=None, sa_column=Column(JSON, nullable=True))
  projects: list["Project"] = Relationship(back_populates="skeins", link_model=ProjectSkeinLink)


'''
=========================================
Project
=========================================
'''
class ProjectSkeinInput(SQLModel):
  skein_id: int
  weight_required: int


class ProjectBase(SQLModel):
  name: str
  category: Category


class ProjectCreate(ProjectBase):
  skeins: list[ProjectSkeinInput] = []


class ProjectSkeinRead(SQLModel):
  skein_id: int
  weight_required: int
  name: str
  brand: Brand
  color: str
  weight: int
  yardage: str
  yardage_unit: YardageUnit

class ProjectUpdate(SQLModel):
  name: str | None = None
  category: Category | None = None
  skeins: list[ProjectSkeinInput] | None = None

class ProjectRead(SQLModel):
  id: int
  name: str
  category: Category
  skeins: list[ProjectSkeinRead]


# TABLE
class Project(ProjectBase, table=True):
  id: int | None = Field(default=None, primary_key=True)
  category: Category = Field(
    sa_column=Column(SAEnum(Category, values_callable=lambda x: [e.value for e in x]))
  )
  skeins: list[Skein] = Relationship(back_populates="projects", link_model=ProjectSkeinLink)
