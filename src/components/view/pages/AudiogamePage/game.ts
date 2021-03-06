import { WordType } from '../../../types';

export function getGameHTML(step: number, length: number): string {
  return `
  <h1 class="audio-game__title">AudioGame - ${step + 1}/${length}</h1>

  <div class="audio-game__result"></div>

  <div class="audio-game__answers"></div>

  <div class="audio-game__next">
    <button class="button next" disabled>Next</button>
  </div>
  
  <pre class="shortkeys">
  Keyboard controls:
  - 1, 2, 3, 4, 5 - choice of answer;
  - space - word audio repeat;
  - enter - next question;
  </pre>
  <audio class="question-audio" src=""></audio>
`;
}

export function getAnswersHTML(index: string[]): string {
  return `
    <button class="button button-game" data-text="${index[0]}">1. ${index[0]}</button>
    <button class="button button-game" data-text="${index[1]}">2. ${index[1]}</button>
    <button class="button button-game" data-text="${index[2]}">3. ${index[2]}</button>
    <button class="button button-game" data-text="${index[3]}">4. ${index[3]}</button>
    <button class="button button-game" data-text="${index[4]}">5. ${index[4]}</button>
`;
}

export function getRightAnswerHTML(word: WordType, img: string): string {
  return `

  <article class="card-container" data-id="${word.id}">
  <div class="card__picture">
    ${img}
  </div>
  <div class="card__content">
    <div class="card__word">

      <div class="card__word-container">
        <div class="card__word-block">
          <h2 class="card__word-text">${word.word}</h2>
          <p class="card__word-transcription">${word.transcription}</p>
        </div>
        <p class="card__word-translate">${word.wordTranslate}</p>
      </div>
    </div>
    <div class="card__meaning">

      <div class="card__meaning-container">
        <p class="card__meaning-text">${word.textMeaning}</p>
        <p class="card__meaning-translate">${word.textMeaningTranslate}</p>
      </div>
    </div>
    <div class="card__example">

      <div class="card__example-container">
        <p class="card__example-text">${word.textExample}</p>
        <p class="card__example-translate">${word.textExampleTranslate}</p>
      </div>
    </div>
  </div>
</article>
`;
}

export function getGameResultsHTML(): string {
  return `
  <h1 class="audio-game__title">AudioGame - results</h1>
  <div class="audio-game__result-all">
    <div class="answers true">
      <h3 class="text-result">Right answers</h3>
      <div class="audio-game__answers-true"></div>
    </div>
    <div class="answers false">
      <h3 class="text-result">Wrong answers</h3>
      <div class="audio-game__answers-false"></div>
    </div>
  </div>
`;
}
