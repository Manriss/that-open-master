import { IProject, Project } from "./Project";
import { errorPopUp } from "../utils";
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
    })
    this.list.push(project);
    this.ui.append(project.ui);

    return project;
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
}
