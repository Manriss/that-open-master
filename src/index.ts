import { IProject, status, userRole } from "./classes/Project";
import { ProjectsManager } from "./classes/ProjectsManager";
import { errorPopUp,getToday,toogleModal } from "./utils";


const projectListUI = document.getElementById("projects-list") as HTMLElement;
const projectsManager = new ProjectsManager(projectListUI);
// This document object is provided by the browser, and its main purpose is to help us interact with the DOM.
const newProjectBtn = document.getElementById("new-project-btn");
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {
    toogleModal("new-project-modal", true);
    const dtPicker=document.getElementById("datePicker") as HTMLInputElement
    dtPicker.value=getToday()

  });
} else {
  console.warn("New projects button was not found");
}

const projectForm = document.getElementById("new-project-form");
if (projectForm) {
  projectForm.addEventListener("click", (e) => {
    const boton = e.target as HTMLButtonElement;
    if (boton.value == "cancel") {
      if (projectForm instanceof HTMLFormElement) {
        projectForm.reset();
        toogleModal("new-project-modal", false);
      }
    }
  });

  projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (projectForm instanceof HTMLFormElement) {
      const formData = new FormData(projectForm);
      const projectData: IProject = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        status: formData.get("status") as status,
        userRole: formData.get("userRole") as userRole,
        finishDate: new Date(formData.get("finishDate") as string),
        id: "",
        cost: 20000,
      };
      try {
        const project = projectsManager.newProject(projectData);
        projectForm.reset();
        toogleModal("new-project-modal", false);
      } catch (err) {
        errorPopUp(err)
      }
    }
  });
} else {
  console.warn("The project form was not found. Check the ID!");
}


const exportProjectsBtn=document.getElementById("export-projects-btn")
if (exportProjectsBtn){
  exportProjectsBtn.addEventListener("click",()=>{projectsManager.exportJSON()})
}

const importProjectsBtn=document.getElementById("import-projects-btn")
if (importProjectsBtn){
  importProjectsBtn.addEventListener("click",()=>{projectsManager.importJSON()})
}
 const sideBarProjectsBtn=document.getElementById("projectsBtn") as HTMLElement
 sideBarProjectsBtn.addEventListener("click",()=>{
  const projectPage=document.getElementById("projects-page")
  const detailPage=document.getElementById("project-details")
  if(!projectPage || !detailPage)return
  projectPage.style.display="flex"
  detailPage.style.display="none"
 })