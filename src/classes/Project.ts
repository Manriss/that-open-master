import { v4 as uuidv4 } from 'uuid'
import { randomColor } from '../utils';

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
  progress:number
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
    this.cost=data.cost;
    this.progress=data.progress;
    this.id = uuidv4()
    this.setUI()
  }
  ui: HTMLElement;
  cost: number
  progress: number 
  color=randomColor()
  private setUI() {
    const iniciales=this.name.slice(0,2)
    this.ui = document.createElement("div");
    this.ui.className = "project-card"
    this.ui.id=this.id
    this.ui.innerHTML = `
          <div  class="card-header">
            <p style="background-color: ${this.color}; padding: 10px; border-radius: 8px; aspect-ratio: 1;text-transform: uppercase;">${iniciales}</p>
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
