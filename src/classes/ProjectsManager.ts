import { IProject, Project,status,userRole } from "./Project";
import { errorPopUp, toogleModal} from "../utils";

export class ProjectsManager {
  list: Project[] = [];
  ui: HTMLElement;
  constructor(container: HTMLElement) {
    this.ui = container;
  }

  newProject(data: IProject) {
   
    const listProjectNames=this.list.map((project)=>{return project.name})
    if (listProjectNames.includes(data.name)){
        throw new Error(`a project with that name (${data.name}) already exists!`)
    }
    const project = new Project(data);
    project.ui.addEventListener("click",()=>{
      const projectPage=document.getElementById("projects-page")
      const detailPage=document.getElementById("project-details")
      if(!projectPage || !detailPage)return
      projectPage.style.display="none"
      detailPage.style.display="flex"
      this.setDetailsPage(project)
    })
    this.list.push(project);
    this.ui.append(project.ui);

    return project;
  }
private setDetailsPage(project){
  const detailsPage=document.getElementById("project-details")
  if(!detailsPage)return
  const nameList=detailsPage.querySelectorAll("[data-project-info='name']")
  const descriptionList=detailsPage.querySelectorAll("[data-project-info='description']")
  const cost=detailsPage.querySelector("[data-project-info='cost']")
  const status=detailsPage.querySelector("[data-project-info='status']")
  const userRole=detailsPage.querySelector("[data-project-info='userRole']")
  const finishDate=detailsPage.querySelector("[data-project-info='finishDate']")
  const progress=detailsPage.querySelector("[data-project-info='progress']") as HTMLElement
  const iniciales=detailsPage.querySelector("[data-project-info='iniciales']") as HTMLElement
  if(nameList){
    nameList.forEach((name)=>{name.textContent=project.name})
    }
   if(descriptionList){
    descriptionList.forEach((description)=>{description.textContent=project.description})
  } 
  if(cost){
    cost.textContent=project.cost
  }
  if(status){
    status.textContent=project.status
  }
  if(userRole){
    userRole.textContent=project.userRole
  }
  if(finishDate){
    console.log(project.finishDate)
    const tempDate=new Date(project.finishDate)
    finishDate.textContent=tempDate.toDateString()
  }
  if(progress){
    progress.style.width=project.progress+"%"
    progress.textContent=project.progress + "%" 
  }
  if(iniciales){
    iniciales.style.backgroundColor=project.color
    const inicial=project.name.slice(0,2)
    iniciales.textContent=inicial
  }
  const editBtn=document.getElementById("edit-project-btn") as HTMLButtonElement
  editBtn.addEventListener("click",()=>{
  this.updateProject(project)

  })
}

  getProject(id: string) {
    const project = this.list.find((project) => {
      return project.id === id;
    });
    return project;
  }
  deleteProject(id: string) {
    const project = this.getProject(id);
    if (!project) return;
    project.ui.remove();
    const remaining = this.list.filter((project) => {
      return project.id != id;
    });
    this.list = remaining;
  }
  getProjectByName(name: string) {
    const project = this.list.find((project) => {
      return project.name == name;
    });
    return project;
  }
  getTotalCost() {
    const totalCost: number = this.list.reduce(
      (sumOfCost, currentProject) => sumOfCost + currentProject.cost,
      0
    );
    return totalCost;
  }
  exportJSON(filename:string="projects"){
   const json= JSON.stringify(this.list,null,2)
   console.log(json)
   const blob=new Blob([json],{type: "application/json"})
   const url=URL.createObjectURL(blob)
   const a =document.createElement("a")
   
   a.href=url
   a.download=filename
   a.click()
   URL.revokeObjectURL(json)
  }

  importJSON(){
    console.log("importing")
    const input=document.createElement('input')
    input.type="file"
    input.accept="application/json"
    const reader=new FileReader()
    reader.addEventListener("load",()=>{
      const json=reader.result
      if(!json)return
      const projects:IProject[]=JSON.parse(json as string)
      for(const project of projects){
        try {
          this.newProject(project)
        } catch (error) {
          errorPopUp(error)
        }       
      }
    })

    input.addEventListener("change",()=>{
      const fileList=input.files
      if(!fileList)return
      reader.readAsText(fileList[0])
    })
input.click()
  }
 
updateProject(project){
  console.log(project)
  toogleModal("edit-project-modal",true)

  const editForm = document.getElementById("edit-project-form");
  if(!editForm)return
  const name=document.querySelector("[data-edit-info='name']") as HTMLInputElement
  const description=document.querySelector("[data-edit-info='description']") as HTMLInputElement
  const status=document.querySelector("[data-edit-info='status']") as HTMLInputElement
  const userRole=document.querySelector("[data-edit-info='userRole']") as HTMLInputElement
  const finishDate=document.querySelector("[data-edit-info='finishDate']") as HTMLInputElement
 //100% sguro que existen
  name.value=project.name
  description.value=project.description
  status.value=project.status
  userRole.value=project.userRole
  //la fecha de project hay que ponerla en formato yyyy-mm-dd
  finishDate.value=project.finishDate



  editForm.addEventListener("click", (e) => {
    const boton = e.target as HTMLButtonElement;
    if (boton.value == "cancel") {
      if (editForm instanceof HTMLFormElement) {
        editForm.reset();
        toogleModal("edit-project-modal", false);
      }
    }
  });

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if ( editForm instanceof HTMLFormElement) {
      const formData = new FormData( editForm);
      const projectData: IProject = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        status: formData.get("status") as status,
        userRole: formData.get("userRole") as userRole,
        finishDate: new Date(formData.get("finishDate") as string),
        id: project.id,
        cost: project.cost,
        progress:project.progress
      };
      try {
        //const project = projectsManager.newProject(projectData);
        console.log(projectData)
        editForm.reset();
        toogleModal("edit-project-modal", false);
      } catch (err) {
        errorPopUp(err)
      }
    }
  });
}

}
