export function getGameHTML(): string {
  return `
  
  <h1 class="sprint__title">SprintGame. Score - <span>0</span></h1>

  <div class="sprint__question-container">
    <div class="dots-wrapper">
      <div class="dots">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
      <p class="text-score-word">+<span>10</span> points per word</p>
    </div>
    <div class="question">
      <p class="word-text">milk</p>
      <p class="word-translate">молоко</p>
    </div>
    <div class="sprint-buttons">
      <button class="button sprint-button button_false " id="btn-false"><div class="btn-choice btn-choice_false"></div> Wrong</button>
      <button class="button sprint-button button_true" id="btn-true">Right <div class="btn-choice btn-choice_true"></div></button>
    </div>

  </div>
  <h2 class="sprint__timer">Time left - <span>01:00</span></h2>
  <pre class="shortkeys">
  Keyboard controls:
  - ArrowLeft and ArrowRight - choice of answer;
  </pre>
`;
}

export function getGameResultsHTML(result: number): string {
  return `
  <h1 class="audio-game__title">SprintGame - results. Score = ${result}</h1>
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
