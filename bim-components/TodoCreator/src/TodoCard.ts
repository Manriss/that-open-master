import * as OBC from "openbim-components";

export class TodoCard extends OBC.SimpleUIComponent {
    onDelete=new OBC.Event()
    onCardClick=new OBC.Event()
    slots: { 
        cardActions:OBC.SimpleUIComponent
     };
    set newName (value:string){
        const newName=this.getInnerElement("name") as HTMLParagraphElement
        newName.textContent=value
    }
    set newDescription (value:string){
        const newDescription=this.getInnerElement("description") as HTMLParagraphElement
        newDescription.textContent=value
    }
    set newDate (value:Date){
        const newDate=this.getInnerElement("date") as HTMLParagraphElement
        newDate.textContent=value.toDateString()
    }


    constructor(component: OBC.Components) {
        const template = `
    <div class="todo-item">    
    <div style="display: flex; justify-content: space-between; align-items: center;">
    <div style="display: flex; column-gap: 15px; align-items: center;">
      <span class="material-icons-round" style="padding: 10px; background-color: #686868; border-radius: 10px;">construction</span>
         <p id="name">Name</p>
    </div>
    <p id="date" style="text-wrap: nowrap; margin-left: 10px;">Date</p>
    </div>
    <hr style="margin-top: 5px;">
    <p id="description" style="margin:5px;">Description</p>
    <hr style="margin-top: 5px;">
    
    <div style="display:flex;justify-content: space-between;">
        <div data-tooeen-slot="cardActions"></div>
    
    </div>
    </div>`

        super(component, template);
        this.get().addEventListener("click",()=>{
            this.onCardClick.trigger()
        })
        this.setSlot("cardActions",new OBC.SimpleUIComponent(this._components))
        const deleteToDoBtn=new OBC.Button(this._components)
        deleteToDoBtn.materialIcon="delete"
        this.slots.cardActions.addChild(deleteToDoBtn)
        deleteToDoBtn.onClick.add(()=>{
            this.onDelete.trigger()
        })
    }
}
