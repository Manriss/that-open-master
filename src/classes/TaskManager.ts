import { IProject, Project, ItodoItem ,status} from "./Project";
import { v4 as uuidv4 } from "uuid";

export class  TaskManager implements ItodoItem{
    name:string;
    description:string;
    finishDate:Date;
    status:status;
    id:string

    constructor(){

    }

    newTask(taskData,project){
        console.log("adding task")
        taskData.id = uuidv4();
        taskData.status ="active";
        project.todoList.push(taskData);
    }
    private updateTaskStatus(taskData:ItodoItem,project:IProject){
        const newToDoList=project.todoList.filter((task)=>{
            return(task.id!=taskData.id)
        })
        newToDoList.push(taskData)
        project.todoList=newToDoList
        const targetHtmlElement=document.getElementById(taskData.id) as HTMLElement
        const btnToUpdate= targetHtmlElement.querySelector("#status-btn") as HTMLElement
        btnToUpdate.textContent=taskData.status
        if(taskData.status=="active"){
          targetHtmlElement.className="todo-item"
        }else{
          targetHtmlElement.className="todo-item-finished"
        }
        
        

    }
    renderTask(taskData:ItodoItem,project:IProject){
        console.log("rendering task")
        const todoList = document.getElementById("TODO-list") as HTMLElement;
        const newUiTask: HTMLElement = document.createElement("div");
        taskData.status=="active"? newUiTask.className = "todo-item":newUiTask.className="todo-item-finished";
        newUiTask.id=taskData.id
        newUiTask.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; column-gap: 15px; align-items: center;">
            <span class="material-icons-round" style="padding: 10px; background-color: #686868; border-radius: 10px;">construction</span>
               <p>${taskData.name}</p>
          </div>
        <p style="text-wrap: nowrap; margin-left: 10px;">${taskData.finishDate.toLocaleString()}</p>
        </div>
        <hr style="margin-top: 5px;">
        <p style="margin:5px;">${taskData.description}</p>
        <hr style="margin-top: 5px;">
        <div style="display:flex; justify-content: end;">
        <p id="status-btn" >${taskData.status}</p>
        </div>`;


        newUiTask.addEventListener("click",()=>{
            let newStatus:status
            console.log("click task ", taskData.id
            )
            const taskStatusDialog: HTMLDialogElement = document.getElementById(
                "task-status-dialog"
              ) as HTMLDialogElement;
            if (taskData.status=="active"){newStatus="finished"}else{newStatus="active"}
              taskStatusDialog.innerHTML = `<div id="error" style="display:flex;flex-direction:column;align-items:center">
              Do yoy want to change the status of the task to <b>${newStatus}</b>
              <div style="display:flex; justify-content:center">
              <button id="no-btn" style="margin:10px; width:100px;display:block;align-text:center">NO</button>
              <button id="yes-btn" style="margin:10px; width:100px;display:block;align-text:center">YES</button>
              </div>
              </div>`;
              taskStatusDialog.showModal();
              const noBtn: HTMLButtonElement = document.getElementById(
                "no-btn"
              ) as HTMLButtonElement;
              const yesBtn: HTMLButtonElement = document.getElementById(
                "yes-btn"
              ) as HTMLButtonElement;
              noBtn.addEventListener("click", () => {
                taskStatusDialog.close();
              })
              yesBtn.addEventListener("click",()=>{
                taskData.status=newStatus;
                this.updateTaskStatus(taskData,project)
                taskStatusDialog.close();
              })
              ;}
        
        )
        todoList.appendChild(newUiTask);
      }
}