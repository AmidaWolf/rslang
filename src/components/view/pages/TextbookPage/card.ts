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

      <div class="card__word">
      <div class="btn-sound word" data-src="${`${ServerApi.baseURL}/${word.audio}`}"></div>

        <div class="card__word-container">
          <div class="card__word-block">
            <h2 class="card__word-text">${word.word}</h2>
            <h3 class="card__word-transcription">${word.transcription}</h3>
          </div>
          <h4 class="card__word-translate">${word.wordTranslate}</h4>
        </div>
      </div>
      <div class="card__meaning">
      <div class="btn-sound meaning" data-src="${`${ServerApi.baseURL}/${word.audioMeaning}`}"></div>
        <div class="card__meaning-container">
          <h2 class="card__meaning-text">${word.textMeaning}</h2>
          <h4 class="card__meaning-translate">${word.textMeaningTranslate}</h4>
        </div>
      </div>
      <div class="card__example">
      <div class="btn-sound example" data-src="${`${ServerApi.baseURL}/${word.audioExample}`}"></div>
        <div class="card__example-container">
          <h2 class="card__example-text">${word.textExample}</h2>
          <h4 class="card__example-translate">${word.textExampleTranslate}</h4>
        </div>
      </div>
    </div>
  </li>
`;
}
