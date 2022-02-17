export function getGameHTML(): string {
  return `
  <pre>
  Keyboard controls:
  - ArrowLeft and ArrowRight - choice of answer;
  </pre>
  <h1 class="sprint__title">SprintGame. Score - <span>0</span></h1>

  <div class="sprint__question-container">
    <div>
      <div class="container dots">
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
      <button class="button" id="btn-false"><span class="btn_choise">&#8592</span> Wrong</button>
      <button class="button" id="btn-true">Right <span class="btn_choise">&#8594</span></button>
    </div>

  </div>
  <h2 class="sprint__timer">Time left - <span>01:00</span></h2>
`;
}

export function getGameResultsHTML(result: number): string {
  return `
  <h1 class="audio-game__title">SprintGame - results. Score = ${result}</h1>
  <div class="audio-game__result-all">
    <div class="container answers true">
      <h3 class="text-result">Right answers</h3>
      <div class="audio-game__answers-true"></div>
    </div>
    <div class="container answers false">
      <h3 class="text-result">Wrong answers</h3>
      <div class="audio-game__answers-false"></div>
    </div>
  </div>
`;
}
