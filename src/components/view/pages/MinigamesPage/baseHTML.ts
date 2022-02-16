const content = `
<section class="minigames">
  <div class="minigames__wrapper">
    <h1 class="minigames__title">Minigames</h1>
    <ul class="minigames__games">
      <li class="game__wrapper">
        <form>
          <h2 class="title-game_text">Audio Game</h2>
          <div class="audio__game select-level">
            <div class="check-container">
              <input type="radio" name="select-audio" id="audio-level-1" value="0" checked>
              <label class="free-label four col" for="audio-level-1">Level 1</label>
            </div>
            <div>
              <input type="radio" name="select-audio" id="audio-level-2" value="1">
              <label class="basic-label four col" for="audio-level-2">Level 2</label>
            </div>
            <div>
              <input type="radio" name="select-audio" id="audio-level-3" value="2">
              <label class="premium-label four col" for="audio-level-3">Level 3</label>
            </div>
            <div>
              <input type="radio" name="select-audio" id="audio-level-4" value="3">
              <label class="free-label four col" for="audio-level-4">Level 4</label>
            </div>
            <div>
              <input type="radio" name="select-audio" id="audio-level-5" value="4">
              <label class="basic-label four col" for="audio-level-5">Level 5</label>
            </div>
            <div>
              <input type="radio" name="select-audio" id="audio-level-6" value="5">
              <label class="premium-label four col" for="audio-level-6">Level 6</label>
            </div>

          </div>
          <div class="start-container audio-container">
            
          </div>
        </form>
      </li>
      <li class="game__wrapper">
        <h2 class="title-game_text">Sprint Game</h2>
        <form>
          <div class="sprint__game select-level">
            <div>
              <input type="radio" name="select-sprint" id="sprint-level-1" value="0" checked>
              <label class="free-label four col" for="sprint-level-1">Level 1</label>
            </div>
            <div>
              <input type="radio" name="select-sprint" id="sprint-level-2" value="1">
              <label class="basic-label four col" for="sprint-level-2">Level 2</label>
            </div>
            <div>
              <input type="radio" name="select-sprint" id="sprint-level-3" value="2">
              <label class="premium-label four col" for="sprint-level-3">Level 3</label>
            </div>
            <div>
              <input type="radio" name="select-sprint" id="sprint-level-4" value="3">
              <label class="free-label four col" for="sprint-level-4">Level 4</label>
            </div>
            <div>
              <input type="radio" name="select-sprint" id="sprint-level-5" value="4">
              <label class="basic-label four col" for="sprint-level-5">Level 5</label>
            </div>
            <div>
              <input type="radio" name="select-sprint" id="sprint-level-6" value="5">
              <label class="premium-label four col" for="sprint-level-6">Level 6</label>
            </div>
          </div>
          <div class="start-container sprint-container">
            
          </div>
        </form>
      </li>
    </ul>
  </div>
  <div class="loading"></div>
</section>
`;

export default content;
