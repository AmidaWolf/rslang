import { ModalContentType } from '../../../types';

export const userContent: ModalContentType = {
  title: 'User info',
  html: `
<form class="authentication">
  <fieldset class="auth-fieldset">
    <label class="auth-label" for="userName">Change user name: </label>
    <input class="auth-input" id="userName" type="text">
    <label class="auth-label" for="email">Change email: </label>
    <input class="auth-input" id="email" type="email">
    <label class="auth-label" for="password">Change password: </label>
    <input class="auth-input" id="password" type="password">
    <p class="password-hint">Password must be at least 8 characters long, have uppercase and lowercase letters and numbers </p>
  </fieldset>
  <p class="error"></p>
  <div class="auth-buttons">
    <div class="modal-loading visibility-hidden"></div>
    <button class="button auth-buttons__button log-out" type="button">Log out</button>
    <button class="button auth-buttons__button update" type="button" disabled>Update info</button>
  </div>
</form>
`,
};
