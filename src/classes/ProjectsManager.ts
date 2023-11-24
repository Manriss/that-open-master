import { IProject, Project, ItodoItem } from "./Project";
import { errorPopUp } from "../utils";
import { v4 as uuidv4 } from "uuid";
import { TaskManager } from "./TaskManager";


export class ProjectsManager {
  list: Project[] = [];
  ui: HTMLElement;
  currentProject:IProject;
  listProjectNames:string[];
  taskManager:TaskManager
  constructor(container: HTMLElement) {
    this.ui = container;
    this.taskManager=new TaskManager()
  }

  newProject(data: IProject) {

    this.listProjectNames = this.list.map((project) => {
      return project.name;
    });

    if (this.listProjectNames.includes(data.name)) {
      throw new Error(
        `a project with that name (${data.name}) already exists!`
      );
    } 
    const project = new Project(data);
    project.ui.addEventListener("click", () => {
      this.currentProject=project
      const projectPage = document.getElementById("projects-page");
      const detailPage = document.getElementById("project-details");
      if (!projectPage || !detailPage) return;
      projectPage.style.display = "none";
      detailPage.style.display = "flex";
      this.setDetailsPage(project);
    });
    this.list.push(project);
    this.ui.append(project.ui);
    return project;
  }

  private setDetailsPage(project:IProject) {
    this.currentProject=project
    const detailsPage = document.getElementById("project-details");
    if (!detailsPage) return;
    const nameList = detailsPage.querySelectorAll("[data-project-info='name']");
    const descriptionList = detailsPage.querySelectorAll(
      "[data-project-info='description']"
    );
    const cost = detailsPage.querySelector("[data-project-info='cost']");
    const status = detailsPage.querySelector("[data-project-info='status']");
    const userRole = detailsPage.querySelector(
      "[data-project-info='userRole']"
    );
    const finishDate = detailsPage.querySelector(
      "[data-project-info='finishDate']"
    );
    const progress = detailsPage.querySelector(
      "[data-project-info='progress']"
    ) as HTMLElement;
    const iniciales = detailsPage.querySelector(
      "[data-project-info='iniciales']"
    ) as HTMLElement;
    if (nameList) {
      nameList.forEach((name) => {
        name.textContent = project.name;
      });
    }
    if (descriptionList) {
      descriptionList.forEach((description) => {
        description.textContent = project.description;
      });
    }
    if (cost) {
      cost.textContent = project.cost.toString();
    }
    if (status) {
      status.textContent = project.status;
    }
    if (userRole) {
      userRole.textContent = project.userRole;
    }
    if (finishDate) {
      const tempDate = new Date(project.finishDate);
      finishDate.textContent = tempDate.toDateString();
    }
    if (progress) {
      progress.style.width = project.progress + "%";
      progress.textContent = project.progress + "%";
    }
    if (iniciales) {
      iniciales.style.backgroundColor = project.color;
      const inicial = project.name.slice(0, 2);
      iniciales.textContent = inicial;
    }
    const todoList = document.getElementById("TODO-list") as HTMLElement;
    todoList.textContent=""
    if(project.todoList.length>0){
      console.log( "hay tasks en project")
      for(let task of project.todoList){
      this.taskManager.renderTask(task,project)
    }}else{
      console.log(project, "no hay tasks en project")

    }


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
    const projectName=project.name
    project.ui.remove();
    const remaining = this.list.filter((project) => {
      return project.id != id;
    });
    this.list = remaining;
    const remainingNames=this.listProjectNames.filter(name=>{
      return name!=projectName
    })
    this.listProjectNames=remainingNames
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
  exportJSON(filename: string = "projects") {
    const json = JSON.stringify(this.list, null, 2);
    console.log(json);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(json);
  }

  importJSON() {
    console.log("importing");
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const json = reader.result;
      if (!json) return;
      const projects: IProject[] = JSON.parse(json as string);
      const projectsID=this.list.map((project)=>{
        return (project.id)
      })
      console.log(projectsID)
      for (const project of projects) {
        if(projectsID.includes(project.id)){
          //remove old project before
          console.log("project updated")
          this.deleteProject(project.id)
          try {
            this.newProject(project);
          } catch (error) {
            errorPopUp(error);
          }
        }else{
          try {
            this.newProject(project);
          } catch (error) {
            errorPopUp(error);
          }
        }
        

      }
    });

    input.addEventListener("change", () => {
      const fileList = input.files;
      if (!fileList) return;
      reader.readAsText(fileList[0]);
    });
    input.click();
  }

  updateProject(projectData) {
    const project=this.currentProject
    this.deleteProject(project.id)
    const updatedProject=this.newProject(projectData)
    this.setDetailsPage(updatedProject)
  }

  
  
  newTask(taskData: ItodoItem, project: IProject) {
/*     console.log("adding task")
    taskData.id = uuidv4();
    taskData.status = "active";
    project.todoList.push(taskData); */
    this.taskManager.newTask(taskData,this.currentProject)
    
    this.taskManager.renderTask(taskData,this.currentProject)
  }
}
