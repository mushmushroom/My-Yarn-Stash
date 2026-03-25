from fastapi import APIRouter,Depends, HTTPException
from sqlmodel import Session, select, delete
from database import get_session

from models import ProjectRead, ProjectCreate, ProjectSkeinRead, ProjectSkeinLink, Project, ProjectUpdate, Skein

router = APIRouter(prefix="/projects")

def _build_project_read(project: Project, session: Session) -> ProjectRead:
    links = session.exec(
        select(ProjectSkeinLink).where(ProjectSkeinLink.project_id == project.id)
    ).all()
    skeins_read = []
    for link in links:
        skein = session.get(Skein, link.skein_id)
        if skein:
            skeins_read.append(ProjectSkeinRead(
                skein_id=skein.id,
                weight_required=link.weight_required,
                name=skein.name,
                brand=skein.brand,
                color=skein.color,
                weight=skein.weight,
                yardage=skein.yardage,
                yardage_unit=skein.yardage_unit,
            ))
    return ProjectRead(id=project.id, name=project.name, category=project.category, skeins=skeins_read)


@router.get("", response_model=list[ProjectRead])
def get_projects(session: Session = Depends(get_session)):
    projects = session.exec(select(Project)).all()
    return [_build_project_read(p, session) for p in projects]


@router.post("", response_model=ProjectRead)
def create_project(project: ProjectCreate, session: Session = Depends(get_session)):
    db_project = Project(name=project.name, category=project.category)
    session.add(db_project)
    session.flush()

    for skein_input in project.skeins:
        if not session.get(Skein, skein_input.skein_id):
            raise HTTPException(status_code=404, detail=f"Skein {skein_input.skein_id} not found")
        session.add(ProjectSkeinLink(
            project_id=db_project.id,
            skein_id=skein_input.skein_id,
            weight_required=skein_input.weight_required,
        ))

    session.commit()
    session.refresh(db_project)
    return _build_project_read(db_project, session)

@router.patch("/{id}")
def update_project(id: int, update: ProjectUpdate, session: Session = Depends(get_session)):
  project = session.get(Project, id)
  if not project:
    raise HTTPException(status_code=404, detail="Project not found")
  if update.name is not None:
    project.name = update.name
  if update.category is not None:
    project.category = update.category
  if update.skeins is not None:
    session.exec(delete(ProjectSkeinLink).where(ProjectSkeinLink.project_id == id))
    for s in update.skeins:
      session.add(ProjectSkeinLink(project_id=id, skein_id=s.skein_id, weight_required=s.weight_required))
  
  session.add(project)
  session.commit()
  session.refresh(project)
  return _build_project_read(project, session)

@router.delete("/{id}", status_code=204)
def delete_project(id: int, session: Session = Depends(get_session)):
    project = session.get(Project, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    session.delete(project)
    session.commit()
