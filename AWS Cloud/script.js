async function loadQuestions() {
    try {
        const response = await fetch('questions.txt');
        const text = await response.text();
        return text.trim().split('\n').map(line => {
            const parts = line.split('|');
            return {
                question: parts[0],
                choices: parts.slice(1, -1),
                correctAnswer: parseInt(parts[parts.length - 1])
            };
        });
    } catch (error) {
        console.error('Failed to load questions:', error);
        return [];
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loadQuiz(questions) {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';
    const shuffledQuestions = shuffle(questions).slice(0, 30); // Seleciona 30 perguntas aleatórias
    shuffledQuestions.forEach((q, index) => {
        const questionElem = document.createElement('div');
        questionElem.classList.add('question');
        questionElem.innerHTML = `
            <p>${q.question}</p>
            ${q.choices.map((choice, i) => `
                <input type="radio" name="question${index}" value="${i}">
                <label>${choice}</label><br>
            `).join('')}
        `;
        quizContainer.appendChild(questionElem);
    });

    // Store the selected questions for later use
    return shuffledQuestions;
}

function checkAnswers(questions) {
    let score = 0;
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = '';

    questions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="question${index}"]:checked`);
        const questionElem = quizContainer.children[index];
        if (selected && parseInt(selected.value) === q.correctAnswer) {
            score++;
            selected.nextElementSibling.classList.add('correct');
        } else {
            if (selected) {
                selected.nextElementSibling.classList.add('incorrect');
            }
            const correctChoice = questionElem.querySelector(`input[value="${q.correctAnswer}"]`).nextElementSibling;
            correctChoice.classList.add('correct');
        }
    });

    alert(`Você acertou ${score} de ${questions.length} perguntas.`);
    resultContainer.innerHTML = `<p>Você acertou ${score} de ${questions.length} perguntas.</p>`;
}

let selectedQuestions = [];

document.getElementById('start-btn').addEventListener('click', async () => {
    const questions = await loadQuestions();
    selectedQuestions = loadQuiz(questions);
    document.getElementById('submit-btn').style.display = 'block';
});

document.getElementById('submit-btn').addEventListener('click', () => {
    checkAnswers(selectedQuestions);
});

document.addEventListener('DOMContentLoaded', async () => {
    // Optionally, you can also load questions here or wait for the user to click "Iniciar Jogo"
});
