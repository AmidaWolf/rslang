export function gameCheckerCard(gameName, rout) {
  const titleGame = gameName[0].toUpperCase() + gameName.slice(1);
  return `
  <li class="game">
    <h2 class="game__title">${titleGame} Game</h2>
    <form class="${gameName}__game game__checker">
      <div class="game__checker-container">
        <input class="game__input" type="radio" name="select-${gameName}" id="${gameName}-level-1" value="0" checked>
        <label class="game__label" for="${gameName}-level-1">Level 1</label>
      </div>
      <div class="game__checker-container">
        <input class="game__input" type="radio" name="select-${gameName}" id="${gameName}-level-2" value="1">
        <label class="game__label" for="${gameName}-level-2">Level 2</label>
      </div>
      <div class="game__checker-container">
        <input class="game__input" type="radio" name="select-${gameName}" id="${gameName}-level-3" value="2">
        <label class="game__label" for="${gameName}-level-3">Level 3</label>
      </div>
      <div class="game__checker-container">
        <input class="game__input" type="radio" name="select-${gameName}" id="${gameName}-level-4" value="3">
        <label class="game__label" for="${gameName}-level-4">Level 4</label>
      </div>
      <div class="game__checker-container">
        <input class="game__input" type="radio" name="select-${gameName}" id="${gameName}-level-5" value="4">
        <label class="game__label" for="${gameName}-level-5">Level 5</label>
      </div>
      <div class="game__checker-container">
        <input class="game__input" type="radio" name="select-${gameName}" id="${gameName}-level-6" value="5">
        <label class="game__label" for="${gameName}-level-6">Level 6</label>
      </div>
    </form>
    <div class="start-container ${gameName}-container">
      <a class="button minigames__btn-start_${gameName}" href="#${rout}">Start Game</a>
    </div>
  </li>
  `;
}
