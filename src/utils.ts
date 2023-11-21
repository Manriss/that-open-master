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
