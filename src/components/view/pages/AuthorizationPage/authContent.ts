import { ModalContentType } from '../../../types';

export const authContent: ModalContentType = {
  title: 'Authorization',
  html: `
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
    <button class="button auth-buttons__button sign-in" type="button">Sign In</button>
    <p class="auth-buttons__text">Needed register new account?</p>
    <button class="link auth-buttons__link sign-up-link">Sign Up</button>
  </div>
</form>
`,
};
