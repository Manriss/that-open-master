import * as OBC from "openbim-components";
import { TodoCard } from "./src/TodoCard";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";
import { ToDo } from "./src/ToDo";

export type priority = "Low" | "Normal" | "High";
export interface Todo {
  camera: {
    position: THREE.Vector3;
    target: THREE.Vector3;
  };
  name: string;
  description: string;
  date: Date;
  fragmentMap: OBC.FragmentIdMap;
  priority: priority;
  id: string;
}
export class TodoCreator
  extends OBC.Component<Todo[]>
  implements OBC.UI, OBC.Disposable
{
  static uuid = "8409cf72-32ba-41e6-a142-f90a1a497403";
  enabled = true;
  private _components: OBC.Components;
  uiElement = new OBC.UIElement<{
    activationButton: OBC.Button;
    todoList: OBC.FloatingWindow;
  }>();
  private List: ToDo[] = [];
  onNewProject = new OBC.Event<Todo>();

  constructor(components: OBC.Components) {
    super(components);
    this._components = components;
    this._components.tools.add(TodoCreator.uuid, this);
    this.setUI();
    this.setup();
  }

  async dispose() {
    this.uiElement.dispose();
    this.List = [];
    this.enabled = false;
  }

  async setup() {
    const higligther = await this._components.tools.get(
      OBC.FragmentHighlighter
    );
    higligther.add(`${TodoCreator.uuid}-priority-Low`, [
      new THREE.MeshStandardMaterial({ color: 0x59bc59 }),
    ]);
    higligther.add(`${TodoCreator.uuid}-priority-Normal`, [
      new THREE.MeshStandardMaterial({ color: 0x597cff }),
    ]);
    higligther.add(`${TodoCreator.uuid}-priority-High`, [
      new THREE.MeshStandardMaterial({ color: 0xff7676 }),
    ]);
  }

  private setUI() {
    const windowToolBar = new OBC.SimpleUIComponent(this._components);
    windowToolBar.get().style.display = "flex";
    const colorizeBtn = new OBC.Button(this.components);
    colorizeBtn.materialIcon = "format_color_fill";
    colorizeBtn.tooltip = "Override by priority";

    windowToolBar.addChild(colorizeBtn);
    const clearAll = new OBC.Button(this._components);
    clearAll.materialIcon = "cleaning_services";
    clearAll.tooltip = "Clear al overrides";
    windowToolBar.addChild(clearAll);
//*********************************** */
const searcherTemplate=`                
<div style="display: flex; align-items: center; column-gap: 10px;">
  <input id="searcher" type="text" placeholder="Search To-Do's by name" style="width: 100%;">
  <span class="material-icons-round">search</span>
</div>`
const searcher = new  OBC.SimpleUIComponent(this._components,searcherTemplate)
    const container=new OBC.SimpleUIComponent(this._components)
    container.get().style.display="flex"
    const searchIcon=new OBC.Button(this._components)
    searchIcon.materialIcon="search"
    const searchBox = new OBC.TextInput(this._components);
    searchBox.label = "";
    const input = searchBox.innerElements.input
    input.style.padding="1px"
    input.addEventListener("input", (e) => {
      console.log(e.target.value);
      this.search(e.target.value);
    });
   // container.addChild(searchBox)
   // container.addChild(searchIcon)
  console.log(searcher.get().childNodes[1])
  searcher.get().childNodes[1].addEventListener("input",(e)=>{
    console.log(e.target.value)
    this.search(e.target.value);
  })
   container.addChild(searcher)
    windowToolBar.addChild(container);

    colorizeBtn.onClick.add(async () => {
      for (const todo of this.List) {
        console.log(todo.priority);
        console.log(todo.fragmentMap);
        const higligther = await this._components.tools.get(
          OBC.FragmentHighlighter
        );
        higligther.highlightByID(
          `${TodoCreator.uuid}-priority-${todo.priority}`,
          todo.fragmentMap
        );
      }
    });
    clearAll.onClick.add(async () => {
      const higligther = await this._components.tools.get(
        OBC.FragmentHighlighter
      );
      higligther.clear(`${TodoCreator.uuid}-priority-Low`);
      higligther.clear(`${TodoCreator.uuid}-priority-Normal`);
      higligther.clear(`${TodoCreator.uuid}-priority-High`);
    });

    const activationButton = new OBC.Button(this._components);
    activationButton.materialIcon = "construction";
    activationButton.tooltip = "To-Do menu";

    const newToDoBtn = new OBC.Button(this._components, { name: "Create" });
    activationButton.addChild(newToDoBtn);

    newToDoBtn.onClick.add(() => {
      const newToDo = new ToDo(this.components);
      const todoList = this.uiElement.get("todoList");
      todoList.addChild(newToDo.uiElement.get("toDoCard"));
      newToDo.onDelete.add(() => {
        const filteredToDos = this.List.filter((todo) => {
          return todo.id != newToDo.id;
        });
        this.List = filteredToDos;
        newToDo.dispose();
      });

      this.List.push(newToDo);
    });

    const listBtn = new OBC.Button(this._components, { name: "List" });
    activationButton.addChild(listBtn);
    listBtn.onClick.add(() => {
      todoList.visible = !todoList.visible;
    });
    const todoList = new OBC.FloatingWindow(this._components);
    this._components.ui.add(todoList);
    todoList.title = "To-DO list";
    todoList.visible = false;
    todoList.addChild(windowToolBar);
    this.uiElement.set({ activationButton, todoList });
  }

  private search(text: string) {
    for (const todo of this.List) {
      if (todo.name.startsWith(text)) {
        todo.uiElement.get("toDoCard").visible = true;
      } else {
        todo.uiElement.get("toDoCard").visible = false;
      }
    }
  }
  get(): Todo[] {
    return this.List;
  }
}
