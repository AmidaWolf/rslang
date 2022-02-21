export function wordsStatisticsCard(
  newWords = 0,
  learnedWords = 0,
  hardWords = 0,
  percentage = 0
) {
  return `
<p class="minigames__new-words">New words: 
  <span class="statistic-count">${newWords}<span></p>
<p class="minigames__percent">Count of learned words: 
  <span class="statistic-count">${learnedWords}<span></p>
  <p class="minigames__percent">Count of hard words: 
  <span class="statistic-count">${hardWords}<span></p>
<p class="minigames__percent">The percentage of correct answers: 
  <span class="statistic-count">${percentage}%<span></p>
  `;
}
