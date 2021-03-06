import { isUserAuthorized } from '../../../shared/helpers/isUserAuthorized';

const content = `
  <section class="container textbook">
    <div class="container-manage">

      <select class="group-words" name="group-words" id="group-words">
        <option selected value="group-1">Group 1</option>
        <option value="group-2">Group 2</option>
        <option value="group-3">Group 3</option>
        <option value="group-4">Group 4</option>
        <option value="group-5">Group 5</option>
        <option value="group-6">Group 6</option>
      </select>

      <div class="textbook__pages">
        <button id="btn-first" disabled class="button button-pagination button-pagination_first"></button>
        <button id="btn-prev" disabled class="button button-pagination button-pagination_prev"></button>
        <p id="page-text" class="page-text">Page&nbsp;<span>1</span></p>
        <button id="btn-next" class="button button-pagination button-pagination_next"></button>
        <button id="btn-last" class="button button-pagination button-pagination_last"></button>
      </div>
      <div class="textbook__games ${
        !isUserAuthorized() ? 'visibility-hidden' : ''
      }">
        <button id="textbook__btn-audio" class="button">Audio</button>
        <button id="textbook__btn-sprint" class="button">Sprint</button>
      </div>
    </div>

    <div class="cards"></div>

    <div class="loading"></div>

    <audio class="audio" src=""></audio>
  </section>
`;

export default content;
