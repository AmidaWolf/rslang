export class Modal {
  async renderHTMLModal() {
    return `
            <div id="modal" class="modal">
                <div class="modal__content-wrapper">
                    <span class="modal__close">&times;</span>
                    <div class="content"></div>
                </div>
            </div>
            `;
  }

  async createModal(innerContent: string, hasCloseButton = true) {
    await this.renderHTMLModal();

    const modal = <HTMLElement>document.getElementById('modal');
    const close = <HTMLElement>document.querySelector('.modal__close');
    const content = <HTMLElement>document.querySelector('.content');
    content.innerHTML = innerContent;

    if (!hasCloseButton) {
      close.style.display = 'none';
    } else {
      const modalClose = () => {
        modal.classList.remove('modal_open');
      };

      const windowClose = (event: MouseEvent) => {
        if (event.target === modal) {
          modal.classList.remove('modal_open');
        }
      };

      window.addEventListener('click', windowClose);

      close.addEventListener('click', modalClose);
    }
  }

  open() {
    const modal = <HTMLElement>document.getElementById('modal');
    modal.classList.add('modal_open');
  }
}
