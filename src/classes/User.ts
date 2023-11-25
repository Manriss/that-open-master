import { v4 as uuidv4 } from "uuid";
export type usersRoles="Architect"|"Engineer"|"Owner"
export type userStatus="Active"|"Inactive"
export interface IUser{
    name:string,
    email:string,
    userRole:usersRoles,
    status:userStatus,
    id:string
  
}

export class User implements IUser{
    name:string
    email:string
    userRole:usersRoles
    status:userStatus
    id:string
    ui:HTMLElement

    constructor (userData:IUser){
        this.name=userData.name
        this.email=userData.email
        this.userRole=userData.userRole
        this.status=userData.status
        this.id=new uuidv4()
        const iniciales = userData.name.slice(0, 2);

        const userUI = document.createElement("tr");
        userUI.className = "usuario";
        userUI.id = new uuidv4();
        userUI.innerHTML = `
    <td style="display:flex;align-items:center;font-size: 20px; background-color: #ca8134; aspect-ratio: 1; border-radius: 100%; padding: 1px;text-transform:uppercase;">${iniciales}</td>
    <td style ="font-size: 20px;padding-left: 20px;">${userData.name}</td>
    <td style ="font-size: 20px;padding-left: 20px;">${userData.email}</td>
    <td style ="font-size: 20px;padding-left: 20px;">${userData.userRole}</td>
    <td style ="font-size: 20px;padding-left: 20px;">${userData.status}</td>
    `;
        this.ui = userUI;
       
console.log(this.id)
    }



}