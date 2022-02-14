import { ModalContentType } from '../../../types';

export const registerContent: ModalContentType = {
  title: 'Registration',
  html: `
<form class="authentication">
  <fieldset class="auth-fieldset">
    <label class="auth-label" for="email">Email: </label>
    <input class="auth-input" id="email" type="email">
    <label class="auth-label" for="password">Password: </label>
    <input class="auth-input" id="password" type="password">
    <label class="auth-label" for="password">Repeat password: </label>
    <input class="auth-input" id="passwordRepeat" type="password">
    <p class="password-hint">Password must be at least 8 characters long, have uppercase and lowercase letters and numbers </p>
  </fieldset>
  <p class="error"></p>
  <div class="auth-buttons">
    <button class="button auth-buttons__button sign-up" type="button">Sign Up</button>
    <p class="auth-buttons__text">Already registered?</p>
    <button class="link auth-buttons__link sign-in-link">Sign In</button>
  </div>
</form>
`,
};
