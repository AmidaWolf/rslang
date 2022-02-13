export class AuthorizationModal {
  modalBaseHTML: string;

  modalContent: string;

  constructor() {
    this.modalBaseHTML = `
      <div class="modal__content-wrapper modal__content-wrapper_auth">
          <button class="button button_modal modal__close"></button>
          <h2 class="modal__title">Authorization:</h2>
          <div class="modal__content modal__content_auth"></div>
      </div>
    `;
    this.modalContent = `
      
      <form class="authentication">
        <fieldset class="auth-fieldset">
          <label class="auth-label" for="email">Email: </label>
          <input class="auth-input" id="email" type="email">
          <label class="auth-label" for="password">Password: </label>
          <input class="auth-input" id="password" type="password">
          <p class="password-hint">Password must be at least 8 characters long, have uppercase and lowercase letters and numbers </p>
        </fieldset>
        <p class="error"></p>
        <div class="auth-buttons">
          <button class="button button_auth sign-in" type="button">Sign In</button>
          <button class="button button_auth sign-up" type="button">Sign Up</button>
          <button class="button button_auth log-out" type="button">Log out</button>
        </div>
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
      signInBtn.classList.add('visibility-hidden');
      signUpBtn.classList.add('visibility-hidden');
      logOutBtn.classList.remove('visibility-hidden');
      authFieldset.style.visibility = 'hidden';
    } else {
      signInBtn.classList.remove('visibility-hidden');
      signUpBtn.classList.remove('visibility-hidden');
      logOutBtn.classList.add('visibility-hidden');
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
