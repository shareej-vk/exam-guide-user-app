document.querySelectorAll('.question-answer-container').forEach(container => {
  const button = container.querySelector('.show-answer-button');
  const answer = container.querySelector('.answer-container');

  button.addEventListener('click', () => {
    const isVisible = answer.style.display === 'block';
    answer.style.display = isVisible ? 'none' : 'block';
    button.textContent = isVisible ? 'Show Answer' : 'Hide Answer';
  });
});