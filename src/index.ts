import { IProject, ItodoItem, status, userRole } from "./classes/Project";
import { ProjectsManager } from "./classes/ProjectsManager";
import { errorPopUp, getToday, toogleModal } from "./utils";

const projectListUI = document.getElementById("projects-list") as HTMLElement;
const projectsManager = new ProjectsManager(projectListUI);
// This document object is provided by the browser, and its main purpose is to help us interact with the DOM.
const newProjectBtn = document.getElementById("new-project-btn");
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {
    toogleModal("new-project-modal", true);
    const dtPicker = document.getElementById("datePicker") as HTMLInputElement;
    dtPicker.value = getToday();
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
        cost: 0,
        progress: 0,
        todoList: [],
        color: "",
      };
      try {
        const project = projectsManager.newProject(projectData);
        projectForm.reset();
        toogleModal("new-project-modal", false);
      } catch (err) {
        errorPopUp(err);
      }
    }
  });
} else {
  console.warn("The project form was not found. Check the ID!");
}

const exportProjectsBtn = document.getElementById("export-projects-btn");
if (exportProjectsBtn) {
  exportProjectsBtn.addEventListener("click", () => {
    projectsManager.exportJSON();
  });
}

const importProjectsBtn = document.getElementById("import-projects-btn");
if (importProjectsBtn) {
  importProjectsBtn.addEventListener("click", () => {
    projectsManager.importJSON();
  });
}
const sideBarProjectsBtn = document.getElementById(
  "projectsBtn"
) as HTMLElement;
sideBarProjectsBtn.addEventListener("click", () => {
  const projectPage = document.getElementById("projects-page");
  const detailPage = document.getElementById("project-details");
  const usersPage=document.getElementById("users-page")
  if (!projectPage || !detailPage ||!usersPage) return;
  projectPage.style.display = "flex";
  detailPage.style.display = "none";
  usersPage.style.display="none"
});

const sideBarUsersBtn = document.getElementById(
  "usersBtn"
) as HTMLElement;
sideBarUsersBtn.addEventListener("click", () => {
  const projectPage = document.getElementById("projects-page");
  const detailPage = document.getElementById("project-details");
  const usersPage=document.getElementById("users-page")
  if (!projectPage || !detailPage||!usersPage) return;
  projectPage.style.display = "none";
  detailPage.style.display = "none";
  usersPage.style.display="flex"
});

const editBtn = document.getElementById(
  "edit-project-btn"
) as HTMLButtonElement;
editBtn.addEventListener("click", (e) => {
 console.log("click en edit")
 toogleModal("edit-project-modal", true);
 const name = document.querySelector(
  "[data-edit-info='name']"
) as HTMLInputElement;
const description = document.querySelector(
  "[data-edit-info='description']"
) as HTMLInputElement;
const status = document.querySelector(
  "[data-edit-info='status']"
) as HTMLInputElement;
const userRole = document.querySelector(
  "[data-edit-info='userRole']"
) as HTMLInputElement;
const cost = document.querySelector(
  "[data-edit-info='cost']"
) as HTMLInputElement;
const progress = document.querySelector(
  "[data-edit-info='progress']"
) as HTMLInputElement;
const finishDate = document.querySelector(
  "[data-edit-info='finishDate']"
) as HTMLInputElement;
   //100% sguro que existen
   name.value = projectsManager.currentProject.name;
   description.value = projectsManager.currentProject.description;
   status.value = projectsManager.currentProject.status;
   userRole.value = projectsManager.currentProject.userRole;
   //la fecha de project hay que ponerla en formato yyyy-mm-dd
   finishDate.value = projectsManager.currentProject.finishDate.toLocaleString();
   cost.value = projectsManager.currentProject.cost.toString();
   progress.value = projectsManager.currentProject.progress.toString();

 
});
const editForm = document.getElementById("edit-project-form") as HTMLFormElement;
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
  if (editForm instanceof HTMLFormElement) {
    const formData = new FormData(editForm);
    console.log(formData)
    const projectData: IProject = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as status,
      userRole: formData.get("userRole") as userRole,
      finishDate: new Date(formData.get("finishDate") as string),
      id: projectsManager.currentProject.id,
      cost: formData.get("cost") as unknown as number,
      progress: formData.get("progress") as unknown as number,
      todoList: projectsManager.currentProject.todoList,
      color:projectsManager.currentProject.color
    };
      
    try {
      projectsManager.updateProject(projectData)
      editForm.reset()
      toogleModal("edit-project-modal", false);
    
    
    } catch (err) {
      errorPopUp(err);
    }
  }
});

     const addToDoBtn = document.getElementById("add-TODO") as HTMLElement;
    if (addToDoBtn) {
      addToDoBtn.addEventListener("click", () => {
        toogleModal("TODO-dialog", true);
        console.log(addToDoBtn)
      });
      const newTaskForm = document.getElementById("TODO-form") as HTMLElement;
      if (newTaskForm) {
        newTaskForm.addEventListener("submit", (e) => {
          e.preventDefault();
          if (newTaskForm instanceof HTMLFormElement) {
            const formData = new FormData(newTaskForm);
            const taskData: ItodoItem = {
              name: formData.get("name") as string,
              description: formData.get("description") as string,
              status: formData.get("status") as status,
              finishDate: new Date(formData.get("finishDate") as string),
              id: "",
            };
            try {
              projectsManager.newTask(taskData, projectsManager.currentProject);
              newTaskForm.reset();
              toogleModal("TODO-dialog", false);
            } catch (err) {
              errorPopUp(err);
            }
          }
        });
      }
    } 