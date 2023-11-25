import { IUser,User } from "./User";
import { v4 as uuidv4 } from "uuid";

export class UserManager {
  userList: IUser[];
  constructor() {
    this.userList = [];
  }

  newUser(userData) {
    const newUser=new User(userData)
    this.userList.push(newUser);
    return newUser
}
}
