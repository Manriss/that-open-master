import { v4 as uuidv4 } from 'uuid'

export type status = "pending" | "active" | "finished"
export type userRole = "Architect" | "engineer" | "developer"

export interface IProject {
  name: string;
  description: string;
  status: status;
  userRole: userRole;
  finishDate: Date;
  id: string;
  cost: number;
}
export class Project implements IProject {
  name: string;
  description: string;
  status: "pending" | "active" | "finished";
  userRole: "Architect" | "engineer" | "developer";
  finishDate: Date;
  id: string;


  constructor(data: IProject) {
    /*   for(const key in data){
        this[key]=data[key]
      }  */
    this.name = data.name;
    this.description = data.description;
    this.status = data.status;
    this.userRole = data.userRole;
    this.finishDate = data.finishDate;
    this.id = uuidv4()
    this.setUI()
  }
  ui: HTMLElement;
  cost: number = 20000;
  progress: number = 25

  private setUI() {
    this.ui = document.createElement("div");
    this.ui.className = "project-card"
    this.ui.innerHTML = `
          <div class="card-header">
            <p style="background-color: #ca8134; padding: 10px; border-radius: 8px; aspect-ratio: 1;">HC</p>
            <div>
              <h5>${this.name}</h5>
              <p>${this.description}</p>
            </div>
          </div>
          <div class="card-content">
            <div class="card-property">
              <p style="color: #969696;">Status</p>
              <p>${this.status}</p>
            </div>
            <div class="card-property">
              <p style="color: #969696;">Role</p>
              <p>${this.userRole}</p>
            </div>
            <div class="card-property">
              <p style="color: #969696;">Cost</p>
              <p>$${this.cost}</p>
            </div>
            <div class="card-property">
              <p style="color: #969696;">Estimated Progress</p>
              <p>${this.progress}%</p>
            </div>
`;
  }
}
