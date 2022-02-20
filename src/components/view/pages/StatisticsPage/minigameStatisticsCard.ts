export function minigameStatisticsCard(
  gameName: string,
  gameNewWords: number,
  gamePercentage: number,
  gameSeries: number
) {
  return `
<div class="minigames-stat">
  <h3 class="minigames-stat__title">${gameName}</h3>
  <p class="minigames-stat__new-words">New words: 
    <span class="statistic-count">${gameNewWords}<span></p>
  <p class="minigames-stat__percent">The percentage of correct answers: 
    <span class="statistic-count">${gamePercentage}%<span></p>
  <p class="minigames-stat__percent">The longest series of correct answers: 
    <span class="statistic-count">${gameSeries}<span></p>
</div>
  `;
}
