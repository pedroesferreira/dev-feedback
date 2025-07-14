let current = 0;
const answers = [];

const output = document.getElementById('output');
const response = document.getElementById('response');
const summary = document.getElementById('summary');

function typeWriter(text, callback) {
  let i = 0;
  function type() {
    if (i < text.length) {
      output.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, 25);
    } else {
      output.innerHTML += "<br/>";
      callback?.();
    }
  }
  type();
}

function updateProgressBar() {
  const total = questions.length;
  const completed = current;
  const percent = Math.round((completed / total) * 100);
  const barLength = 20;
  const filled = Math.round((percent / 100) * barLength);
  const empty = barLength - filled;
  const bar = "[" + "#".repeat(filled) + "-".repeat(empty) + `] ${percent}%`;
  output.innerHTML += `<p>> Progress: ${bar}</p>`;
}

function askQuestion() {
  typeWriter(`> ${questions[current]}`, () => {
    updateProgressBar();
    response.value = '';
    response.focus();
  });
}

response.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // prevent line break
      const text = response.value.trim();
      if (text === '') return;
  
      answers.push({ question: questions[current], answer: text });
      output.innerHTML += `<p>> ${text}</p>`; // echo typed response
  
      current++;
      if (current < questions.length) {
        askQuestion();
      } else {
        finish();
      }
    }
});

function finish() {
  output.innerHTML += `<p>> ALL QUESTIONS COMPLETE.</p>`;
  response.style.display = 'none';

  let resultText = "=== FEEDBACK SUMMARY ===\n";
  answers.forEach((qa, i) => {
    resultText += `Q${i+1}: ${qa.question}\nA: ${qa.answer}\n\n`;
  });

  summary.style.display = 'block';
  summary.textContent = resultText;

  const copyBtn = document.createElement('button');
  copyBtn.textContent = "Copy to Clipboard";
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(resultText);
    alert("Feedback copied!");
  };
  summary.appendChild(copyBtn);
}

// Initialize
askQuestion();
