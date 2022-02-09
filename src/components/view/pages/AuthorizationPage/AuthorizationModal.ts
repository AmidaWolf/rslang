import './AuthorizationModal.scss';

export class AuthorizationModal {
  modalBaseHTML: string;

  modalContent: string;

  constructor() {
    this.modalBaseHTML = `
      <div class="modal__content-wrapper">
          <span class="modal__close">&times;</span>
          <div class="modal__content">

          </div>
      </div>
    `;
    this.modalContent = `
      <p class="validation-error"></p>
      <form class="authentication">
        <fieldset class="auth-fieldset">
          <label for="email">Email: </label>
          <input id="email" type="email">
          <label for="password">Password: </label>
          <input id="password" type="password">
        </fieldset>

        <button class="sign-in" type="button">Sign In</button>
        <button class="sign-up" type="button">Sign Up</button>
        <button class="log-out" type="button">Log out</button>
      </form>
    `;
  }

  toggleAuthorizationButtons() {
    const signInBtn = <HTMLElement>document.querySelector('.sign-in');
    const signUpBtn = <HTMLElement>document.querySelector('.sign-up');
    const logOutBtn = <HTMLElement>document.querySelector('.log-out');
    const authFieldset = <HTMLElement>document.querySelector('.auth-fieldset');
    const message = localStorage.getItem('userMessage');

    if (message === 'Authenticated') {
      signInBtn.classList.add('hide-auth-btn');
      signUpBtn.classList.add('hide-auth-btn');
      logOutBtn.classList.remove('hide-auth-btn');
      authFieldset.style.visibility = 'hidden';
    } else {
      signInBtn.classList.remove('hide-auth-btn');
      signUpBtn.classList.remove('hide-auth-btn');
      logOutBtn.classList.add('hide-auth-btn');
      authFieldset.style.visibility = 'visible';
    }
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

  async createModal(innerContent: string, hasCloseButton = true) {
    const header = <HTMLElement>document.querySelector('.header');
    await this.createModalHTML(header);

    const modal = <HTMLElement>document.getElementById('modal');
    const close = <HTMLElement>document.querySelector('.modal__close');
    const content = <HTMLElement>document.querySelector('.modal__content');
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
      this.toggleAuthorizationButtons();
    }
  }

  async toggleModal() {
    const modal = <HTMLElement>document.getElementById('modal');

    if (modal) {
      if (modal.classList.contains('modal_open')) {
        modal.classList.remove('modal_open');
      } else {
        modal.classList.add('modal_open');
      }
    }
  }

  async run(loginButton: HTMLElement) {
    const modal = <HTMLElement>document.querySelector('.modal');

    if (!modal) {
      this.createModal(this.modalContent, true).then(() => {
        loginButton.addEventListener('click', () => {
          this.toggleModal();
        });
      });
    } else {
      loginButton.addEventListener('click', () => {
        this.toggleModal();
      });
    }
  }
}
