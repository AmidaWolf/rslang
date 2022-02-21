import { WordType } from '../../../types';
import ServerApi from '../../../shared/utils/serverApi';
import { isUserAuthorized } from '../../../shared/helpers/isUserAuthorized';

export function getWordCard(word: WordType): string {
  const userId = localStorage.getItem('userId');
  const isAuthAndUserId = !!(isUserAuthorized() && userId);
  const wordControlsButtons = isAuthAndUserId
    ? `
  <button class="button difficult-word ${
    word.userWord?.difficulty === 'hard' ? 'difficult-active' : ''
  } data-button="difficult">Difficult word</button>

  <button class="button learnt-word ${
    word.userWord?.optional?.learnt ? 'learnt-active' : ''
  }" data-button="learnt">Learnt word</button>
  `
    : '';
  let classWordContainer = '';
  if (word.userWord?.difficulty) classWordContainer += word.userWord.difficulty;
  if (word.userWord?.optional?.learnt) classWordContainer += ' learnt';

  return `
      <div class="card-container ${classWordContainer}" data-id="${word.id}">
        <div class="card__picture">
          <div class="card__picture-image-wrapper">
            <img 
              class="card__picture-image" 
              src="${ServerApi.baseURL}/${word.image}" 
              alt="${word.word}" 
              width="390" 
              height="260"
            >
          </div>
          <div class="card__controls">
            ${wordControlsButtons}
          </div>
        </div>
        <div class="card__content">
          <div class="card__word">
          <button class="button btn-sound word" data-src="${`${ServerApi.baseURL}/${word.audio}`}"></button>
            <div class="card__word-container">
              <div class="card__word-block">
                <h2 class="card__word-text">${word.word}</h2>
                <p class="card__word-transcription">${word.transcription}</p>
              </div>
              <p class="card__word-translate">${word.wordTranslate}</p>
            </div>
          </div>
          <div class="card__meaning">
          <button class="button btn-sound meaning" data-src="${`${ServerApi.baseURL}/${word.audioMeaning}`}"></button>
            <div class="card__meaning-container">
              <p class="card__meaning-text">${word.textMeaning}</p>
              <p class="card__meaning-translate">${
                word.textMeaningTranslate
              }</p>
            </div>
          </div>
          <div class="card__example">
          <button class="button btn-sound example" data-src="${`${ServerApi.baseURL}/${word.audioExample}`}"></button>
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
