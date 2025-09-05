document.addEventListener('DOMContentLoaded', () => {
    const introButton = document.getElementById('introButton');
    const assistantWindow = document.getElementById('assistant-window');
    const messageDisplay = document.getElementById('message-display');
    const listenButton = document.getElementById('listenButton');
    const statusMessage = document.getElementById('status-message');

    // **IMPORTANT: REPLACE THESE PLACEHOLDER URLS WITH YOUR ACTUAL PUBLISHED GOOGLE SITE URLS**
    const pageUrls = {
        '4OsTest': 'https://sites.google.com/view/praghna-learning-centre/4-os-test',
        'definitions': 'https://sites.google.com/view/praghna-learning-centre/definitions-and-terms',
        'subject': 'https://sites.google.com/view/praghna-learning-centre/subject',
        'quiz': 'https://sites.google.com/view/praghna-learning-centre/quiz-yourself'
    };

    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechSynthesis = window.SpeechSynthesis;

    if (!SpeechRecognition || !SpeechSynthesis) {
        statusMessage.textContent = "Your browser does not support the Web Speech API. Please use a modern browser like Chrome.";
        listenButton.style.display = 'none';
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    
    const synth = window.speechSynthesis;

    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        synth.speak(utterance);
    }

    function addMessage(text, sender) {
        const message = document.createElement('p');
        message.textContent = text;
        message.classList.add(sender);
        messageDisplay.appendChild(message);
        messageDisplay.scrollTop = messageDisplay.scrollHeight;
    }

    introButton.addEventListener('click', () => {
        const introButtonContainer = document.querySelector('.intro-button-container');
        introButtonContainer.style.display = 'none';
        assistantWindow.style.display = 'flex';
        const welcomeText = "Hello! Welcome to our research methodology tests. We have tests on Before You Begin (4Os Test), Definitions and Terms, how to choose a subject, and how to identify a research issue. Please tell me which test you would like to take.";
        addMessage(welcomeText, 'assistant-message');
        speak(welcomeText);
    });

    listenButton.addEventListener('click', () => {
        statusMessage.textContent = "Listening...";
        recognition.start();
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        addMessage(transcript, 'user-message');
        statusMessage.textContent = "Processing...";
        handleUserCommand(transcript);
    };

    recognition.onerror = (event) => {
        statusMessage.textContent = `Error: ${event.error}. Please try again.`;
    };

    function handleUserCommand(command) {
        let testChosen = '';

        if (command.includes('definitions') || command.includes('terms')) {
            testChosen = 'definitions';
        } else if (command.includes('subject') || command.includes('topic')) {
            testChosen = 'subject';
        } else if (command.includes('issue') || command.includes('newspaper')) {
            testChosen = 'issue';
        }

        if (testChosen && pageUrls[testChosen]) {
            const redirectText = `Great! Redirecting you to the ${testChosen} test.`;
            addMessage(redirectText, 'assistant-message');
            speak(redirectText);
            
            setTimeout(() => {
                window.location.href = pageUrls[testChosen];
            }, 3000);
        } else {
            const retryText = "I'm sorry, I didn't understand that. Please say the name of the test you'd like to take.";
            addMessage(retryText, 'assistant-message');
            speak(retryText);
        }
    }
});

