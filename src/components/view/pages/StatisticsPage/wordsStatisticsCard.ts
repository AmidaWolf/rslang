export function wordsStatisticsCard(
  newWords: number,
  learnedWords: number,
  percentage: number
) {
  return `
<p class="minigames__new-words">New words: 
  <span class="statistic-count">${newWords}<span></p>
<p class="minigames__percent">Count of learned words: 
  <span class="statistic-count">${learnedWords}<span></p>
<p class="minigames__percent">The percentage of correct answers: 
  <span class="statistic-count">${percentage}%<span></p>
  `;
}
