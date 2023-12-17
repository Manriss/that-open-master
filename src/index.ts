import { IProject, ItodoItem, status, userRole } from "./classes/Project";
import { ProjectsManager } from "./classes/ProjectsManager";
import { UserManager } from "./classes/UserManager";
import { errorPopUp, getToday, toogleModal } from "./utils";
import { IUser, usersRoles, userStatus } from "./classes/User";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as OBC from "openbim-components";
import { FragmentsGroup } from "bim-fragment";
import { TodoCreator } from "../bim-components/TodoCreator";
import { TaskManager } from "./classes/TaskManager";
const projectListUI = document.getElementById("projects-list") as HTMLElement;
const projectsManager = new ProjectsManager(projectListUI);
const userManager = new UserManager();
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
  const usersPage = document.getElementById("users-page");
  if (!projectPage || !detailPage || !usersPage) return;
  projectPage.style.display = "flex";
  detailPage.style.display = "none";
  usersPage.style.display = "none";
});

const sideBarUsersBtn = document.getElementById("usersBtn") as HTMLElement;
sideBarUsersBtn.addEventListener("click", () => {
  const projectPage = document.getElementById("projects-page");
  const detailPage = document.getElementById("project-details");
  const usersPage = document.getElementById("users-page");
  if (!projectPage || !detailPage || !usersPage) return;
  projectPage.style.display = "none";
  detailPage.style.display = "none";
  usersPage.style.display = "flex";
});

const editBtn = document.getElementById(
  "edit-project-btn"
) as HTMLButtonElement;
editBtn.addEventListener("click", (e) => {
  console.log("click en edit");
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
const editForm = document.getElementById(
  "edit-project-form"
) as HTMLFormElement;
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
    console.log(formData);
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
      color: projectsManager.currentProject.color,
    };

    try {
      projectsManager.updateProject(projectData);
      editForm.reset();
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
    console.log(addToDoBtn);
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
const searchTaskBox=document.getElementById("search-task")
if (searchTaskBox instanceof HTMLInputElement){
searchTaskBox.addEventListener("input",(e)=>{
search(e.target.value)
})

}
function search(text: string) {
  const todoList = document.getElementById("TODO-list") as HTMLElement;
  todoList.innerHTML=""
  for (const todo of projectsManager.currentProject.todoList) {
    if (todo.name.startsWith(text)) {
      projectsManager.taskManager.renderTask(todo,projectsManager.currentProject)
    } else {
     
    }
  }
}
const newUserBtn = document.getElementById("addUserBtn") as HTMLElement;
newUserBtn.addEventListener("click", () => {
  console.log("click");
  toogleModal("new-user-modal", true);
});

const newUserForm = document.getElementById("new-user-form") as HTMLElement;
if (newUserForm) {
  newUserForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (newUserForm instanceof HTMLFormElement) {
      const formData = new FormData(newUserForm);
      const userData: IUser = {
        name: formData.get("name") as string,
        userRole: formData.get("userRole") as usersRoles,
        status: formData.get("userStatus") as userStatus,
        email: formData.get("email") as string,
        id: "",
      };
      try {
        const newUser = userManager.newUser(userData);
        const htmlUsersList = document.getElementById(
          "user-list"
        ) as HTMLElement;
        htmlUsersList.appendChild(newUser.ui);
        newUserForm.reset();
        toogleModal("new-user-modal", false);
      } catch (err) {
        errorPopUp(err);
      }
    }
  });
}

// OpenBIM Components Viewer
//OpenBIM-Components viewer
const viewer = new OBC.Components();

const sceneComponent = new OBC.SimpleScene(viewer);
sceneComponent.setup();
viewer.scene = sceneComponent;
const scene = sceneComponent.get();
scene.background = null;

const viewerContainer = document.getElementById(
  "viewer-container"
) as HTMLDivElement;
const rendererComponent = new OBC.PostproductionRenderer(
  viewer,
  viewerContainer
);
viewer.renderer = rendererComponent;

const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer);
viewer.camera = cameraComponent;

const raycasterComponent = new OBC.SimpleRaycaster(viewer);
viewer.raycaster = raycasterComponent;

viewer.init();
cameraComponent.updateAspect();
rendererComponent.postproduction.enabled = true;

const fragmentManager = new OBC.FragmentManager(viewer);

function exportFragment(model: FragmentsGroup) {
  const fragment = fragmentManager.export(model);
  const blob = new Blob([fragment]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${model.name}.frag`.replace(".ifc", "");
  a.click();
  URL.revokeObjectURL(url);
}

const importFragmentBtn = new OBC.Button(viewer);
importFragmentBtn.materialIcon = "upload";
importFragmentBtn.tooltip = "upload Fragment";

importFragmentBtn.onClick.add(() => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".frag";
  const reader = new FileReader();
  reader.addEventListener("load", async () => {
    const binary = reader.result;
    if (!(binary instanceof ArrayBuffer)) {
      return;
    }
    const binaryFragment = new Uint8Array(binary);
    await fragmentManager.load(binaryFragment);
    
  });
  input.addEventListener("change", () => {
    const fileList = input.files;
    if (!fileList) return;
    console.log(fileList[0].name)
    reader.readAsArrayBuffer(fileList[0]);
  });
  input.click();
});
fragmentManager.onFragmentsLoaded.add((model)=>{
  importJsonProperties(model)
})

const ifcLoader = new OBC.FragmentIfcLoader(viewer);

ifcLoader.settings.wasm = {
  path: "https://unpkg.com/web-ifc@0.0.43/",
  absolute: true,
};

const highlighter = new OBC.FragmentHighlighter(viewer);
highlighter.setup();

const classifier = new OBC.FragmentClassifier(viewer);
const classificationWindow = new OBC.FloatingWindow(viewer);
viewer.ui.add(classificationWindow);
classificationWindow.title = "Model Groups";
classificationWindow.visible=false

const classificationBtn = new OBC.Button(viewer);
classificationBtn.materialIcon = "account_tree";
classificationBtn.onClick.add(() => {
  classificationWindow.visible
    ? (classificationWindow.visible = false)
    : (classificationWindow.visible = true);
  classificationBtn.active
    ? (classificationBtn.active = false)
    : (classificationBtn.active = false);
});

const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer);
highlighter.events.select.onClear.add((x) => {
  propertiesProcessor.cleanPropertiesList();
});
async function createModelTree() {
  const fragmentTree = new OBC.FragmentTree(viewer);
  await fragmentTree.init();
  await fragmentTree.update(["model", "entities"]);
  
  fragmentTree.onHovered.add((fragmentMap) => {
    highlighter.highlightByID("hover", fragmentMap);
  });
  fragmentTree.onSelected.add((fragmentMap) => {
    highlighter.highlightByID("select", fragmentMap);
  });
  console.log(fragmentTree.get())
  const tree = fragmentTree.get().uiElement.get("tree");
  return tree;
}
function exportJsonProperties(model:FragmentsGroup){
  const json = JSON.stringify(model.properties, null, 2);
  
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${model.name}`.replace(".ifc","");
  a.click();
  URL.revokeObjectURL(json);
}
function importJsonProperties(model:FragmentsGroup){
    console.log("importing");
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    const reader = new FileReader();
    reader.addEventListener("load", async() => {
      const json = reader.result as string;
      if (!json) return;
      model.properties=JSON.parse(json)
      onModelLoaded(model)
        return
      })
    input.addEventListener("change", () => {
      const fileList = input.files;
      if (!fileList) return;
      reader.readAsText(fileList[0]);
    });
    input.click();
}
const culler=new OBC.ScreenCuller(viewer)
cameraComponent.controls.addEventListener("sleep",()=>{
  culler.needsUpdate=true
})
async function onModelLoaded(model:FragmentsGroup){
  try {
    propertiesProcessor.process(model);
    for(const fragment of model.items){
      culler.add(fragment.mesh)
    }
    culler.needsUpdate=true
    highlighter.update();
    highlighter.events.select.onHighlight.add((fragmentMap) => {
      console.log(fragmentMap);
      console.log([Object.values(fragmentMap)[0]][0]);
      const expID = [...Object.values(fragmentMap)[0]][0];
      console.log(expID);
      propertiesProcessor.renderProperties(model, Number(expID));
    });
  
    classifier.byModel(model.name, model);
    classifier.byStorey(model);
    classifier.byEntity(model);
    classifier.byPredefinedType(model);
    //const filteredResult=await classifier.find({entities:["IFCBEAM"]})
    classifier.byIfcRel(model, 4186316022, "custom");
    //console.log(filteredResult)
    console.log(classifier);
    const tree = await createModelTree();
    await classificationWindow.slots.content.dispose(true);
    classificationWindow.addChild(tree);
    console.log(fragmentManager.list)
  } catch (error) {
    console.warn(error);
    
  }
 
}
ifcLoader.onIfcLoaded.add(async (model) => {
  exportFragment(model);
  exportJsonProperties(model);
  onModelLoaded(model)
});
const todoCreator=new TodoCreator(viewer)

importFragmentBtn.tooltip="import fragment"

const toolbar = new OBC.Toolbar(viewer);
toolbar.addChild(
  ifcLoader.uiElement.get("main"),
  classificationBtn,
  propertiesProcessor.uiElement.get("main"),
  importFragmentBtn,
  todoCreator.uiElement.get("activationButton")
);
viewer.ui.addToolbar(toolbar);
