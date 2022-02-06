import { WordType } from '../../../types';
import ServerApi from '../../../shared/utils/serverApi';

export function getCardWord(word: WordType): string {
  return `
  <li class="card-container" data-id="${word.id}">
    <div class="card__picture">
      <img class="card__picture-src" src="https://rs-school-learn-words.herokuapp.com/${
        word.image
      }" alt="Picture">
    </div>
    <div class="card__content">
      <div class="btn-sound" data-id="${word.id}"></div>
      <audio src="${`${ServerApi.baseURL}/${word.audio}`}" data-id="${
    word.id
  }"></audio>
      <div class="card__word">

        <div class="card__word-container">
          <div class="card__word-block">
            <div class="card__word-text">${word.word}</div>
            <div class="card__word-transcription">${word.transcription}</div>
          </div>
          <div class="card__word-translate">${word.wordTranslate}</div>
        </div>
      </div>
      <div class="card__meaning">

        <div class="card__meaning-container">
          <div class="card__meaning-text">${word.textMeaning}</div>
          <div class="card__meaning-translate">${
            word.textMeaningTranslate
          }</div>
        </div>
      </div>
      <div class="card__example">

        <div class="card__example-container">
          <div class="card__example-text">${word.textExample}</div>
          <div class="card__example-translate">${
            word.textExampleTranslate
          }</div>
        </div>
      </div>
    </div>
  </li>
`;
}
