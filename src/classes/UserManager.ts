
import { v4 as uuidv4 } from "uuid";
export type usersRoles="Architect"|"Engineer"|"Owner"
export type userStatus="Active"|"Inactive"
export interface IUser{
    name:string,
    email:string,
    userRole:usersRoles,
    status:userStatus,
    id:string
    ui?:HTMLElement
}
export class UserManager 
{
userList:IUser[]
constructor(){

this.userList=[]

}
ui:HTMLElement
newUser(userData){
  
    
const userUI=document.createElement("li") 
userUI.className="usuario"
userUI.id=new uuidv4()
userUI.innerHTML=`
<div style="display:flex;align-items:center;font-size: 20px; background-color: #ca8134; aspect-ratio: 1; border-radius: 100%; padding: 12px;;">ML</div>
<div style ="font-size: 20px;;padding: 15px;border-radius: 18px;">${userData.name}</div>
<div style ="font-size: 20px;;padding: 15px;border-radius: 18px;">${userData.email}</div>
<div style ="font-size: 20px;padding: 15px;border-radius: 18px;">${userData.userRole}</div>
<div style ="font-size: 20px;padding: 15px;border-radius: 18px;">${userData.status}</div>
`
userData.ui=userUI
this.userList.push(userData)
return userData
}

}



