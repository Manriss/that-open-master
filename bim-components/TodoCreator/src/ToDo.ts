import * as OBC from "openbim-components";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";
import { priority, Todo } from "..";
import { TodoCard } from "./TodoCard";

export class ToDo
  extends OBC.Component<Todo>
  implements OBC.UI, OBC.Disposable, Todo {
  onDelete = new OBC.Event();
  enabled = true;
  camera: { position: THREE.Vector3; target: THREE.Vector3 };
  name: string;
  description: string;
  date: Date;
  fragmentMap: OBC.FragmentIdMap;
  priority: priority;
  id: string;
  uiElement = new OBC.UIElement<{
    toDoCard: OBC.SimpleUIComponent;
    form: OBC.Modal;
  }>();
  private _components;
  constructor(components: OBC.Components) {
    super(components);
    this._components = components;
    this.date = new Date();
    this.id = new uuidv4();
    this.setUI();
    this.getCameraInfo();
    this.getSelection();
    const ntd = this.uiElement.get("form");
    ntd.visible = true;
  }

  setUI() {
    const toDoCard = new TodoCard(this._components);
    toDoCard.onDelete.add(() => {
      this.onDelete.trigger()
    });
    toDoCard.onCardClick.add(() => {
      this.setFocus()
    })
    const form = new OBC.Modal(this._components, "New TO-DO");
    this._components.ui.add(form);

    const nameInput = new OBC.TextInput(this._components);
    nameInput.label = "Name";
    form.slots.content.addChild(nameInput);

    const descriptionInput = new OBC.TextArea(this._components);
    descriptionInput.label = "Description";
    form.slots.content.addChild(descriptionInput);

    const priorityInput = new OBC.Dropdown(this._components);
    priorityInput.addOption("Low", "Normal", "High");
    priorityInput.label = "Priority";
    priorityInput.value = "Normal";
    form.slots.content.addChild(priorityInput);

    form.slots.content.get().style.padding = "20px";
    form.slots.content.get().style.display = "flex";
    form.slots.content.get().style.flexDirection = "column";
    form.slots.content.get().style.columnGap = "10px";

    form.onCancel.add(() => {
      form.visible = false;
    });
    form.onAccept.add(() => {
      toDoCard.newName = nameInput.value;
      this.name=nameInput.value
      toDoCard.newDescription = descriptionInput.value;
      this.description=descriptionInput.value
      toDoCard.newDate = this.date;
      this.priority = priorityInput.value as priority;
      nameInput.value = "";
      descriptionInput.value = "";
      form.visible = false;
    });
    this.uiElement.set({ form, toDoCard });
  }
  private async getSelection() {
    const higligther = await this.components.tools.get(OBC.FragmentHighlighter);
    this.fragmentMap = higligther.selection.select;
  }
  private async getCameraInfo() {
    const camera = this.components.camera;
    if (camera instanceof OBC.OrthoPerspectiveCamera) {
      let position = new THREE.Vector3();
      camera.controls.getPosition(position);
      let target = new THREE.Vector3();
      camera.controls.getTarget(target);
      this.camera = { position, target };
    }
  }
  private async setFocus() {
    const higligther = await this.components.tools.get(OBC.FragmentHighlighter);
    const camera = this.components.camera;
    if (camera instanceof OBC.OrthoPerspectiveCamera) {
      higligther.highlightByID("select", this.fragmentMap)
      camera.controls.setLookAt(
        this.camera.position.x,
        this.camera.position.y,
        this.camera.position.z,
        this.camera.target.x,
        this.camera.target.y,
        this.camera.target.z,
        true
      )
    }
  }
  async dispose() {
    this.uiElement.dispose();
  }

  get() {
    return this;
  }
}
