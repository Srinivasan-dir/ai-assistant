document.addEventListener('DOMContentLoaded', () => {
    const assistantWindow = document.getElementById('assistant-window');
    const messageDisplay = document.getElementById('message-display');
    const listenButton = document.getElementById('listenButton');
    const statusMessage = document.getElementById('status-message');

    // **IMPORTANT: REPLACE THESE PLACEHOLDER URLS WITH YOUR ACTUAL PUBLISHED GOOGLE SITE URLS**
    const pageUrls = {
        'begin': 'https://sites.google.com/view/praghna-learning-centre/4-os-test',
        'definitions': 'https://sites.google.com/view/praghna-learning-centre/definitions-and-terms',
        'subject': 'https://sites.google.com/view/praghna-learning-centre/subject',
        'issue': 'https://sites.google.com/view/praghna-learning-centre/identify-issue-and-literature-review',
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

    // Function to start the assistant immediately on page load
    function startAssistant() {
        const welcomeText = "Hello! Welcome to our research methodology tests. We have tests on Before You Begin, Definitions and Terms, choose a subject, Identify Issue and Literature Review and some Quiz to test your knowledge. Please tell me which test you would like to take.";
        addMessage(welcomeText, 'assistant-message');
        speak(welcomeText);
    }
    
    // Call the function on page load
    startAssistant();

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

        if (command.includes('begin') || command.includes('begin')) {
            testChosen = 'begin';
        } else if (command.includes('definitions') || command.includes('terms')) {
            testChosen = 'definitions';
        } else if (command.includes('subject') || command.includes('topic')) {
            testChosen = 'subject';
        } else if (command.includes('issue') || command.includes('issue')) {
            testChosen = 'issue';
        } else if (command.includes('quiz') || command.includes('quiz')) {
            testChosen = 'quiz';
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




