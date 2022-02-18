import { WordType } from '../../../types';
import ServerApi from '../../../shared/utils/serverApi';
import { isUserAuthorized } from '../../../shared/helpers/isUserAuthorized';
import {
  getLocalDifficultArr,
  getLocalLearntArr,
  getSetFromArray,
} from '../../../shared/helpers/dataManipulations';

function toggleButtonClass(
  array: string[] | never[],
  btnClass: string,
  wordId: string
): string {
  const set = getSetFromArray(array);
  if (set.has(wordId)) {
    return btnClass;
  }
  return '';
}

export function getWordCard(word: WordType): string {
  const userId = localStorage.getItem('userId');

  if (isUserAuthorized() && userId) {
    return `
      <div class="card-container" data-id="${word.id}">
        <div class="card__picture">
          <img class="card__picture-src" src="https://rs-school-learn-words.herokuapp.com/${
            word.image
          }" alt="Picture">
          <div class="card__controls">
            <button class="difficult-word ${toggleButtonClass(
              getLocalDifficultArr(userId),
              'difficult-active',
              word.id
            )}" data-button="difficult">Difficult word</button>

            <button class="learnt-word ${toggleButtonClass(
              getLocalLearntArr(userId),
              'learnt-active',
              word.id
            )}" data-button="learnt">Learnt word</button>
          </div>
        </div>
        <div class="card__content">
          <div class="card__word">
          <button class="btn-sound word" data-src="${`${ServerApi.baseURL}/${word.audio}`}"></button>
            <div class="card__word-container">
              <div class="card__word-block">
                <h2 class="card__word-text">${word.word}</h2>
                <p class="card__word-transcription">${word.transcription}</p>
              </div>
              <p class="card__word-translate">${word.wordTranslate}</p>
            </div>
          </div>
          <div class="card__meaning">
          <button class="btn-sound meaning" data-src="${`${ServerApi.baseURL}/${word.audioMeaning}`}"></button>
            <div class="card__meaning-container">
              <p class="card__meaning-text">${word.textMeaning}</p>
              <p class="card__meaning-translate">${
                word.textMeaningTranslate
              }</p>
            </div>
          </div>
          <div class="card__example">
          <button class="btn-sound example" data-src="${`${ServerApi.baseURL}/${word.audioExample}`}"></button>
            <div class="card__example-container">
              <p class="card__example-text">${word.textExample}</p>
              <p class="card__example-translate">${
                word.textExampleTranslate
              }</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  return `
      <div class="card-container" data-id="${word.id}">
        <div class="card__picture">
          <img class="card__picture-src" src="https://rs-school-learn-words.herokuapp.com/${
            word.image
          }" alt="Picture">
        </div>
        <div class="card__content">
          <div class="card__word">
          <button class="btn-sound word" data-src="${`${ServerApi.baseURL}/${word.audio}`}"></button>
            <div class="card__word-container">
              <div class="card__word-block">
                <h2 class="card__word-text">${word.word}</h2>
                <p class="card__word-transcription">${word.transcription}</p>
              </div>
              <p class="card__word-translate">${word.wordTranslate}</p>
            </div>
          </div>
          <div class="card__meaning">
          <button class="btn-sound meaning" data-src="${`${ServerApi.baseURL}/${word.audioMeaning}`}"></button>
            <div class="card__meaning-container">
              <p class="card__meaning-text">${word.textMeaning}</p>
              <p class="card__meaning-translate">${
                word.textMeaningTranslate
              }</p>
            </div>
          </div>
          <div class="card__example">
          <button class="btn-sound example" data-src="${`${ServerApi.baseURL}/${word.audioExample}`}"></button>
            <div class="card__example-container">
              <p class="card__example-text">${word.textExample}</p>
              <p class="card__example-translate">${
                word.textExampleTranslate
              }</p>
            </div>
          </div>
        </div>
      </div>
    `;
}
