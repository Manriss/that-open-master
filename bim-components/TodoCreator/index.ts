
import * as OBC from "openbim-components";
import { TodoCard } from "./src/TodoCard";
import * as  THREE from "three"
import { v4 as uuidv4 } from "uuid";

type priority="Low"|"Normal"|"High"
interface Todo{
  camera:{
    position:THREE.Vector3,
    target:THREE.Vector3
  }
  name:string
  description:string
  date:Date
  fragmentMap:OBC.FragmentIdMap
  priority:priority
  id:string
  ui:TodoCard
}
export class TodoCreator extends OBC.Component<Todo[]> implements OBC.UI, OBC.Disposable {
  static uuid = "8409cf72-32ba-41e6-a142-f90a1a497403";
  enabled= true;
  private _components: OBC.Components;
  uiElement = new OBC.UIElement<{
    activationButton: OBC.Button;
    todoList: OBC.FloatingWindow;
  }>();
private List:Todo[]=[]
  onNewProject=new OBC.Event<Todo>()

  constructor(components: OBC.Components) {
    super(components);
    this._components = components;
    this._components.tools.add(TodoCreator.uuid, this);
    this.setUI();
    this.setup()
  }

  async dispose(){
    this.uiElement.dispose()
    this.List=[]
    this.enabled=false
  };

  async setup(){
    const higligther=await this._components.tools.get(OBC.FragmentHighlighter)
    higligther.add(`${TodoCreator.uuid}-priority-Low`,[new THREE.MeshStandardMaterial({color:0x59bc59})])
    higligther.add(`${TodoCreator.uuid}-priority-Normal`,[new THREE.MeshStandardMaterial({color:0x597cff})])
    higligther.add(`${TodoCreator.uuid}-priority-High`,[new THREE.MeshStandardMaterial({color:0xff7676})])
  }

  private setUI() {
    const windowToolBar=new OBC.SimpleUIComponent(this._components)
    windowToolBar.get().style.display="flex"
    const colorizeBtn=new OBC.Button(this.components)
    colorizeBtn.materialIcon="format_color_fill"
    colorizeBtn.tooltip="Override by priority"
    
    windowToolBar.addChild(colorizeBtn)
    const clearAll=new OBC.Button(this._components)
    clearAll.materialIcon="cleaning_services"
    clearAll.tooltip="Clear al overrides"
    windowToolBar.addChild(clearAll)

    colorizeBtn.onClick.add(async()=>{
      for (const todo of this.List){
        const higligther=await this._components.tools.get(OBC.FragmentHighlighter)
        higligther.highlightByID(`${TodoCreator.uuid}-priority-${todo.priority}`,todo.fragmentMap)
      }
    })
    clearAll.onClick.add(async ()=>{
      const higligther=await this._components.tools.get(OBC.FragmentHighlighter)
      higligther.clear(`${TodoCreator.uuid}-priority-Low`)
      higligther.clear(`${TodoCreator.uuid}-priority-Normal`)
      higligther.clear(`${TodoCreator.uuid}-priority-High`)
    })

    const activationButton = new OBC.Button(this._components);
    activationButton.materialIcon = "construction";
    activationButton.tooltip="To-Do menu"

    const newToDoBtn = new OBC.Button(this._components, { name: "Create" });
    activationButton.addChild(newToDoBtn);

    newToDoBtn.onClick.add(()=>{
      form.visible=true
    })

    const listBtn = new OBC.Button(this._components, { name: "List" });
    activationButton.addChild(listBtn);

    listBtn.onClick.add(() => {
      todoList.visible = !todoList.visible;
    });

    const todoList = new OBC.FloatingWindow(this._components);
    this._components.ui.add(todoList);
    todoList.title = "To-DO list";
    todoList.visible = false;

    todoList.addChild(windowToolBar)
    const form=new OBC.Modal(this._components,"New TO-DO")
    this._components.ui.add(form)

    const nameInput=new OBC.TextInput(this._components)
    nameInput.label="Name"
    form.slots.content.addChild(nameInput)

    const descriptionInput=new OBC.TextArea(this._components)
    descriptionInput.label="Description"
    form.slots.content.addChild(descriptionInput)

    const priorityInput=new OBC.Dropdown(this._components)
    priorityInput.addOption("Low","Normal","High")
    priorityInput.label="Priority"
    priorityInput.value="Normal"
    form.slots.content.addChild(priorityInput)

    form.slots.content.get().style.padding="20px"
    form.slots.content.get().style.display="flex"
    form.slots.content.get().style.flexDirection="column"
    form.slots.content.get().style.columnGap="10px"
    form.onCancel.add(()=>{
      form.visible=false
    })
    form.onAccept.add(()=>{
      form.data
      this.newToDO(nameInput.value,descriptionInput.value,priorityInput.value as priority)
      nameInput.value=""
      descriptionInput.value=""

      form.visible=false
    })

    this.uiElement.set({ activationButton, todoList });
  }

  async newToDO(name:string,description:string,priority:priority){
    if(!this.enabled){return}
    const higligther=await this.components.tools.get(OBC.FragmentHighlighter)
    const camera=this._components.camera
    if(!(camera instanceof OBC.OrthoPerspectiveCamera)){
      return new console.error("wrong camera type");
      
    }
    let position=new THREE.Vector3()
    camera.controls.getPosition(position)
    let target=new THREE.Vector3()
    camera.controls.getTarget(target)
    const newTodoCard=new TodoCard(this.components)
    const newToDo:Todo={
      name: name,
      description: description,
      date: new Date(),
      fragmentMap: higligther.selection.select,
      camera:{position,target},
      priority:priority,
      id:new uuidv4(),
      ui:newTodoCard
    }
    
    
    newTodoCard.newName=newToDo.name
    newTodoCard.newDate=newToDo.date
    newTodoCard.newDescription=newToDo.description
    const todoList=this.uiElement.get("todoList")
    todoList.addChild(newTodoCard) 
    this.List.push(newToDo)
    higligther.clear()
    newTodoCard.onCardClick.add(()=>{
      if (Object.keys(newToDo.fragmentMap).length===0)return
      higligther.highlightByID("select",newToDo.fragmentMap)
      camera.controls.setLookAt(
        newToDo.camera.position.x,
        newToDo.camera.position.y,
        newToDo.camera.position.z,
        newToDo.camera.target.x,
        newToDo.camera.target.y,
        newToDo.camera.target.z,
        true
      )
    })
    
    newTodoCard.onDelete.add(()=>{
    this.deleteToDo(newToDo)
    })
    this.onNewProject.trigger(newToDo)
  }
  
  deleteToDo(toDo){ 
  const updatedToDos=this.List.filter((todo)=>{
      return(todo.id!=toDo.id)
    })
  this.List=updatedToDos 
  const todoList=this.uiElement.get("todoList")
  todoList.removeChild(toDo.ui)
  toDo.ui.dispose()
  }

  get(): Todo[] {
   return this.List
  }
}
