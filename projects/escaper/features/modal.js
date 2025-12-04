class Modal {
  constructor() {
    this.dialog = document.querySelector('dialog');
    if (!this.dialog) {
      throw new Error('Dialog element not found');
    }
    this.dialog.addEventListener('close', this._onClose.bind(this));
    this.dialog.addEventListener('click', this._onClick.bind(this));
  }

  _onClose(e) {
    e.target.innerHTML = '';
  }

  _onClick(e) {
    const rect = this.dialog.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      this.dialog.close();
    }
  }

  /*
   * Show a modal dialog with the given content.
   * @param {HTMLElement} modal - The content to display inside the modal dialog.
   */
  show(modal) {
    this.dialog.innerText = '';
    this.dialog.appendChild(modal);
    this.dialog.showModal();
  }

  hide() {
    this.dialog.innerText = '';
    this.dialog.close();
  }
}

export default new Modal();
