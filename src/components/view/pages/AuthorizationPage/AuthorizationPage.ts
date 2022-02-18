import ServerApi from '../../../shared/utils/serverApi';
import { AuthorizationModal } from './AuthorizationModal';
import {
  ErrorType,
  GetTokensType,
  SignRequestBody,
  UpdateUserBodyType,
  UserBodyType,
} from '../../../types';
import { authContent } from './authContent';
import { registerContent } from './registerContent';
import {
  logOutUser,
  userDataLocalStorageWorker,
} from '../../../shared/helpers/UserDataLocalStorageWorker';

export class AuthorizationPage {
  modal: AuthorizationModal;

  constructor() {
    this.modal = new AuthorizationModal();
  }

  removeLoading() {
    const loading = <HTMLElement>document.querySelector('.modal-loading');
    loading.classList.add('visibility-hidden');
  }

  addLoading() {
    const loading = <HTMLElement>document.querySelector('.modal-loading');
    loading.classList.remove('visibility-hidden');
  }

  setEmailToLocalStorage(email: string) {
    localStorage.setItem('userEmail', email);
  }

  setUserNameToLocalStorage(username: string | undefined) {
    if (typeof username === 'string') {
      localStorage.setItem('userName', username);
    }
  }

  addErrorMessage(text: string) {
    const errorElement = <HTMLElement>document.querySelector('.error');
    errorElement.innerText = text;
  }

  async switchHiddenSectionsAccess() {
    // TODO Add required functional to show or hide target blocks

    const message = localStorage.getItem('userMessage');
    if (message === 'Authenticated') {
      console.log('Authenticated');
    } else if (message === 'Error') {
      console.log('Not Authenticated');
    }
  }

  userIsLogged() {
    const message = localStorage.getItem('userMessage');
    return message === 'Authenticated';
  }

  async validateUserData(tokens: GetTokensType | ErrorType, email: string) {
    if (tokens.message === 'Error' || tokens.message === 'LoggedOut') {
      localStorage.setItem('userMessage', tokens.message);
      this.addErrorMessage(
        'Password minimum 8 symbols, uppercase and lowercase character, one digit. Correct email required'
      );
    } else {
      userDataLocalStorageWorker(tokens);
      this.setEmailToLocalStorage(email);
      window.location.reload();
    }
  }

  async getCheckedFormData(): Promise<SignRequestBody | undefined> {
    const emailReg =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passReg = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}/g;

    const emailInput = <HTMLInputElement>document.getElementById('email');
    const passwordInput = <HTMLInputElement>document.getElementById('password');
    const passwordRepeatInput = <HTMLInputElement>(
      document.getElementById('passwordRepeat')
    );

    const logInData = {
      email: emailInput.value,
      password: passwordInput.value,
    };
    let result: typeof logInData | undefined;

    const checkEmailAndPassword = () => {
      if (
        emailReg.test(emailInput.value) &&
        passReg.test(passwordInput.value)
      ) {
        console.log(logInData);
        result = logInData;
      } else {
        this.addErrorMessage(
          'Password minimum 8 symbols, uppercase and lowercase character, one digit. Correct email required'
        );
      }
    };

    if (passwordRepeatInput) {
      if (passwordRepeatInput.value === passwordInput.value) {
        checkEmailAndPassword();
      } else {
        this.addErrorMessage('The passwords must match');
      }
    } else {
      checkEmailAndPassword();
    }

    return result;
  }

  checkEmails(): SignRequestBody | undefined {
    const emailRepeatInput = <HTMLInputElement>(
      document.getElementById('emailRepeat')
    );
    const emailInput = <HTMLInputElement>document.getElementById('email');
    const passwordInput = <HTMLInputElement>document.getElementById('password');

    const logInData = {
      email: emailInput.value,
      password: passwordInput.value,
    };

    let result: typeof logInData | undefined;

    if (emailRepeatInput) {
      if (emailRepeatInput.value !== emailInput.value) {
        this.addErrorMessage('Try write email correctly');
      } else {
        result = logInData;
      }
    }
    return result;
  }

  async signInUser(logInData: SignRequestBody) {
    ServerApi.signIn(logInData)
      .then((result: GetTokensType | ErrorType | number) => {
        if (typeof result === 'number') {
          if (result === 403) {
            this.addErrorMessage('Incorrect password for this user.');
          } else if (result === 404) {
            this.addErrorMessage('This email is not registered.');
          }
        } else {
          this.validateUserData(result, logInData.email);
          this.switchHiddenSectionsAccess();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async signUpUser(signInData: UserBodyType) {
    ServerApi.createUser(signInData)
      .then((result) => {
        if (typeof result === 'number') {
          if (result === 417) {
            this.addErrorMessage('User with this email is already registered.');
          }
        } else {
          this.signInUser(signInData);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async deleteUser() {
    const userId = localStorage.getItem('userId');

    await ServerApi.deleteUser(userId).then(async () => {
      await logOutUser();
    });
  }

  async updateUserInfo() {
    const usernameInput = <HTMLInputElement>document.getElementById('username');
    const emailInput = <HTMLInputElement>document.getElementById('email');
    const passwordInput = <HTMLInputElement>document.getElementById('password');

    const userId = localStorage.getItem('userId');
    let userInfo: UpdateUserBodyType;

    if (usernameInput.value) {
      userInfo = {
        email: emailInput.value,
        password: passwordInput.value,
        name: usernameInput.value,
      };
    } else {
      userInfo = {
        email: emailInput.value,
        password: passwordInput.value,
      };
    }

    return ServerApi.updateUser(userId, userInfo);
  }

  async addFormButtonsListener() {
    const signInBtn = <HTMLElement>document.querySelector('.sign-in');
    const signUpBtn = <HTMLElement>document.querySelector('.sign-up');
    const logOutBtn = <HTMLElement>document.querySelector('.log-out');
    const signInLinkBtn = <HTMLElement>document.querySelector('.sign-in-link');
    const signUpLinkBtn = <HTMLElement>document.querySelector('.sign-up-link');
    const updateBtn = <HTMLElement>document.querySelector('.update');
    const deleteBtn = <HTMLElement>document.querySelector('.delete');

    const signInClick = (event) => {
      const button = <HTMLButtonElement>event.target;
      this.getCheckedFormData().then((logInData) => {
        if (logInData) {
          this.addLoading();
          button.disabled = true;
          this.signInUser(logInData).then(() => {
            this.removeLoading();
            button.disabled = false;
          });
        }
      });
    };

    const signUpClick = (event) => {
      const button = <HTMLButtonElement>event.target;
      this.getCheckedFormData().then((logInData) => {
        if (logInData) {
          button.disabled = true;
          this.addLoading();
          this.signUpUser(logInData).then(() => {
            this.removeLoading();
            button.disabled = false;
          });
        }
      });
    };

    const signInClickLink = () => {
      this.modal.createModal(authContent, true).then(() => {
        this.addFormButtonsListener();
      });
    };

    const signUpClickLink = () => {
      this.modal.createModal(registerContent, true).then(() => {
        this.addFormButtonsListener();
      });
    };

    const logOutClick = (event) => {
      const button = <HTMLButtonElement>event.target;
      button.disabled = true;
      this.addLoading();
      logOutUser();
      this.removeLoading();
      button.disabled = false;
    };

    const deleteClick = (event) => {
      const button = <HTMLButtonElement>event.target;
      const loginData = this.checkEmails();
      if (loginData) {
        button.disabled = true;
        this.addLoading();
        this.deleteUser().then(() => {
          this.removeLoading();
          button.disabled = false;
        });
      }
    };

    const updateClick = (event) => {
      const button = <HTMLButtonElement>event.target;
      this.getCheckedFormData().then((loginData) => {
        if (loginData) {
          button.disabled = true;
          this.addLoading();
          this.updateUserInfo().then((result) => {
            this.removeLoading();
            button.disabled = false;
            this.setEmailToLocalStorage(result.email);
            this.setUserNameToLocalStorage(result.name);
            this.modal.setUserInfo();
          });
        }
      });
    };

    if (signInBtn) {
      signInBtn.addEventListener('click', signInClick);
    }

    if (signUpBtn) {
      signUpBtn.addEventListener('click', signUpClick);
    }

    if (logOutBtn) {
      logOutBtn.addEventListener('click', logOutClick);
    }

    if (signInLinkBtn) {
      signInLinkBtn.addEventListener('click', signInClickLink);
    }

    if (signUpLinkBtn) {
      signUpLinkBtn.addEventListener('click', signUpClickLink);
    }

    if (updateBtn) {
      updateBtn.addEventListener('click', updateClick);
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', deleteClick);
    }
  }

  async afterRender() {
    console.log('afterRender is not implemented');
  }

  async run() {
    await this.addFormButtonsListener();
  }
}
