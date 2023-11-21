export function toogleModal(id: string, visible: boolean) {
  const modal = document.getElementById(id);
  if (modal && modal instanceof HTMLDialogElement) {
    visible ? modal.showModal() : modal.close();
  } else {
    console.warn("The provided modal wasn't found. ID: ", id);
  }
}
export function errorPopUp(err){
    const errorDialog: HTMLDialogElement = document.getElementById(
        "error-dialog"
      ) as HTMLDialogElement;
      errorDialog.innerHTML = `<div id="error" style="display:flex;flex-direction:column;align-items:center">${err}
      <button id="close-error-dialog" style="margin:10px; width:100px;display:block;align-text:center">OK</button>
      </div>`;
      errorDialog.showModal();
      const closeButton: HTMLButtonElement = document.getElementById(
        "close-error-dialog"
      ) as HTMLButtonElement;
      closeButton.addEventListener("click", () => {
        errorDialog.close();
      });

}
export function randomColor(){
  const r=Math.floor(Math.random()*255)
  const g=Math.floor(Math.random()*255)
  const b=Math.floor(Math.random()*255)
  return (`rgb(${r},${g},${b})`)
}

export function getToday(){
  let date = new Date().toJSON().slice(0, 10);;
  return date
}