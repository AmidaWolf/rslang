import ServerApi from '../../../shared/utils/serverApi';
import { AuthorizationModal } from './AuthorizationModal';
import {
  ErrorType,
  GetTokensType,
  SignRequestBody,
  UserBodyType,
} from '../../../types';
import { authContent } from './authContent';
import { registerContent } from './registerContent';

export class AuthorizationPage {
  modal: AuthorizationModal;

  constructor() {
    this.modal = new AuthorizationModal();
  }

  setUserDataToLocalStorage(tokens: GetTokensType | ErrorType) {
    localStorage.setItem('userMessage', tokens.message);
    localStorage.setItem('userName', tokens.name);
    localStorage.setItem('userRefToken', tokens.refreshToken);
    localStorage.setItem('userToken', tokens.token);
    localStorage.setItem('userId', tokens.userId);
  }

  setEmailToLocalStorage(email: string) {
    localStorage.setItem('userEmail', email);
  }

  addErrorMessage(text: string) {
    const errorElement = <HTMLElement>document.querySelector('.error');
    errorElement.innerText = text;
  }

  updateLocalStorageOnLogOut() {
    localStorage.setItem('userMessage', 'LoggedOut');
    localStorage.setItem('userName', '');
    localStorage.setItem('userRefToken', '');
    localStorage.setItem('userToken', '');
    localStorage.setItem('userId', '');
    localStorage.setItem('userEmail', '');
    localStorage.setItem('userOptions', '');
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
      this.setUserDataToLocalStorage(tokens);
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

  async logOutUser() {
    this.updateLocalStorageOnLogOut();
    window.location.reload();
  }

  async addFormButtonsListener() {
    const signInBtn = <HTMLElement>document.querySelector('.sign-in');
    const signUpBtn = <HTMLElement>document.querySelector('.sign-up');
    const logOutBtn = <HTMLElement>document.querySelector('.log-out');
    const signInLinkBtn = <HTMLElement>document.querySelector('.sign-in-link');
    const signUpLinkBtn = <HTMLElement>document.querySelector('.sign-up-link');

    const signInClick = () => {
      this.getCheckedFormData().then((logInData) => {
        if (logInData) {
          this.signInUser(logInData);
        }
      });
    };

    const signUpClick = () => {
      this.getCheckedFormData().then((logInData) => {
        if (logInData) {
          this.signUpUser(logInData);
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

    const logOutClick = () => {
      this.logOutUser();
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
  }

  async afterRender() {
    console.log('afterRender is not implemented');
  }

  async run() {
    await this.addFormButtonsListener();
  }
}
