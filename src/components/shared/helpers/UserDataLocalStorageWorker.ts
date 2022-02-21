import { ErrorType, GetTokensType } from '../../types';

export function userDataLocalStorageWorker(tokens: GetTokensType | ErrorType) {
  localStorage.setItem('userMessage', tokens.message);
  if (tokens.name) {
    localStorage.setItem('userName', tokens.name);
  } else {
    localStorage.setItem('userName', '');
  }
  localStorage.setItem('userRefToken', tokens.refreshToken);
  localStorage.setItem('userToken', tokens.token);
  localStorage.setItem('userId', tokens.userId);
}

export function updateLocalStorageOnLogOut() {
  localStorage.setItem('userMessage', 'LoggedOut');
  localStorage.setItem('userName', '');
  localStorage.setItem('userRefToken', '');
  localStorage.setItem('userToken', '');
  localStorage.setItem('userId', '');
  localStorage.setItem('userEmail', '');
  localStorage.setItem('userOptions', '');
  localStorage.setItem('learntWords', '');
  localStorage.setItem('difficultWords', '');
}

export function logOutUser() {
  updateLocalStorageOnLogOut();
  window.location.href = '/#/';
  window.location.reload();
}
