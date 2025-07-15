let current = 0;
let ascii_counter = 0;
let intro_counter = 0;
let state = 'ascii'; // can be 'ascii', 'intro', or 'questions'
const answers = [];

const output = document.getElementById('output');
const response = document.getElementById('response');
const summary = document.getElementById('summary');

response.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // prevent line break
        const text = response.value.trim();

        if (state === 'intro') {
            response.value = '';
            state = 'questions';
            askQuestion();
            return;
        }

        if (state === 'questions') {
            if (text === '') return;
        
            answers.push({ question: questions[current], answer: text });
            output.innerHTML += `<p>>&nbsp;${text}</p>`; // echo typed response

            // Scroll to bottom smoothly
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            response.value = ''; // clear input
        
            current++;
            if (current < questions.length) {
                askQuestion();
            } else {
                finish();
            }
        }
    }
});

response.addEventListener('input', () => {
    response.style.height = 'auto'; // reset
    response.style.height = response.scrollHeight + 'px'; // set to scroll height
});

function typeWriter(text, callback, speed = 25) {
    let i = 0;
    function type() {
        if (i < text.length) {
            const char = text.charAt(i) === ' ' ? '&nbsp;' : text.charAt(i);
            output.innerHTML += char;
            i++;
            setTimeout(type, speed);
            //type();
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
    updateProgressBar();
    typeWriter(`> ${questions[current]}`, () => {
        response.value = '';
        response.focus();
    });
}

function startIntro() {
    typeWriter(`> ${intro[intro_counter]}`, () => {
        intro_counter++;
        if (intro_counter < intro.length) {
            startIntro();
            state = 'intro';
        }
        response.focus();
    });
}

function startAscii() {
    typeWriter(`> ${asciiart[ascii_counter]}`, () => {
        ascii_counter++;
        if (ascii_counter < asciiart.length) {
            startAscii();
        } else {
            startIntro(); // After ASCII art is done, show intro
        }
    }, 0.1);
}

function finish() {
    updateProgressBar();
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

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = "Download Feedback";
    downloadBtn.onclick = () => {
        const blob = new Blob([resultText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'developer_feedback.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    summary.appendChild(copyBtn);
    summary.append("  ");
    summary.appendChild(downloadBtn);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// Initialize
startAscii();
