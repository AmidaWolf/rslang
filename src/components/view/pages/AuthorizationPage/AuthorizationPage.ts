import ServerApi from '../../../shared/utils/serverApi';
import { AuthorizationModal } from './AuthorizationModal';
import {
  UserBodyType,
  SignRequestBody,
  GetTokensType,
  ErrorType,
} from '../../../types';

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

  addValidationError() {
    const validationError = <HTMLElement>(
      document.querySelector('.validation-error')
    );
    validationError.innerText =
      'Password minimum 8 symbols, uppercase and lowercase character, one digit. Correct email required';
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

  async validateUserData(tokens: GetTokensType | ErrorType, email: string) {
    if (tokens.message === 'Error' || tokens.message === 'LoggedOut') {
      localStorage.setItem('userMessage', tokens.message);
      this.addValidationError();
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
    const logInData = {
      email: emailInput.value,
      password: passwordInput.value,
    };
    let result: typeof logInData | undefined;

    if (emailReg.test(emailInput.value) && passReg.test(passwordInput.value)) {
      console.log(logInData);
      result = logInData;
    }

    return result;
  }

  async singInUser(logInData: SignRequestBody) {
    ServerApi.signIn(logInData)
      .then((tokens: GetTokensType | ErrorType) => {
        this.validateUserData(tokens, logInData.email);
        this.switchHiddenSectionsAccess();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async signUpUser(signInData: UserBodyType) {
    ServerApi.createUser(signInData)
      .then(() =>
        ServerApi.signIn(signInData).then(
          (tokens: GetTokensType | ErrorType) => {
            this.validateUserData(tokens, signInData.email);
            this.switchHiddenSectionsAccess();
          }
        )
      )
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

    signInBtn.addEventListener('click', () => {
      this.getCheckedFormData().then((logInData) => {
        if (logInData) {
          this.singInUser(logInData);
        } else {
          this.addValidationError();
        }
      });
    });
    signUpBtn.addEventListener('click', () => {
      this.getCheckedFormData().then((logInData) => {
        if (logInData) {
          this.signUpUser(logInData);
        } else {
          this.addValidationError();
        }
      });
    });
    logOutBtn.addEventListener('click', () => {
      this.logOutUser();
    });
  }

  async afterRender() {
    console.log('afterRender is not implemented');
  }

  async run() {
    this.addFormButtonsListener();
  }
}
