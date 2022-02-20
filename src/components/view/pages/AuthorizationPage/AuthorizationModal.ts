import { userContent } from './userContent';
import { ModalContentType } from '../../../types';
import { authContent } from './authContent';

export class AuthorizationModal {
  modalBaseHTML: string;

  constructor() {
    this.modalBaseHTML = `
      <div class="modal__content-wrapper modal__content-wrapper_auth">
          <button class="button button_modal modal__close"></button>
          <h2 class="modal__title"></h2>
          <div class="modal__content modal__content_auth"></div>
      </div>
    `;
  }

  async createModalHTML(container: HTMLElement) {
    const existingModal = <HTMLElement>document.getElementById('modal');
    if (!existingModal) {
      const modal = document.createElement('div');
      modal.id = 'modal';
      modal.className = 'modal';
      modal.innerHTML = this.modalBaseHTML;
      container.append(modal);
    }
  }

  async createModal(innerContent: ModalContentType, hasCloseButton = true) {
    const header = <HTMLElement>document.querySelector('.header');
    await this.createModalHTML(header);

    const modal = <HTMLElement>document.getElementById('modal');
    const close = <HTMLElement>document.querySelector('.modal__close');
    const content = <HTMLElement>document.querySelector('.modal__content');
    const modalTitle = <HTMLElement>document.querySelector('.modal__title');
    modalTitle.innerText = innerContent.title;
    content.innerHTML = innerContent.html;

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

  async toggleModal() {
    const modal = <HTMLElement>document.getElementById('modal');

    if (modal.classList.contains('modal_open')) {
      modal.classList.remove('modal_open');
    } else {
      modal.classList.add('modal_open');
    }
  }

  setUserInfo() {
    const usernameInput = <HTMLInputElement>document.getElementById('username');
    const emailInput = <HTMLInputElement>document.getElementById('email');

    const username = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');

    if (typeof username === 'string') {
      usernameInput.value = username;
    }
    emailInput.value = email || '';
  }

  async run(
    loginButton: HTMLElement,
    logged: boolean,
    innerContent = authContent
  ) {
    if (logged) {
      this.createModal(userContent, true).then(() => {
        this.setUserInfo();
        loginButton.addEventListener('click', () => {
          this.toggleModal();
        });
      });
    } else {
      this.createModal(innerContent, true).then(() => {
        loginButton.addEventListener('click', () => {
          this.toggleModal();
        });
      });
    }
  }
}
