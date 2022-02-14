import { ModalContentType } from '../../../types';

export const userContent: ModalContentType = {
  title: 'User info',
  html: `
<form class="authentication">
  <p class="error"></p>
  <div class="auth-buttons">
    <button class="button auth-buttons__button log-out" type="button">Log out</button>
    <button class="button auth-buttons__button update" type="button" disabled>Update info</button>
  </div>
</form>
`,
};
