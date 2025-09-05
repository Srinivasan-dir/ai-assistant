document.addEventListener('DOMContentLoaded', () => {
    const introButton = document.getElementById('introButton');
    const assistantDiv = document.getElementById('assistant');
    const aiMessage = document.getElementById('aiMessage');
    const listenButton = document.getElementById('listenButton');

    // URLs for your Google Site pages
    const pageUrls = {
        '4OsTest': 'https://sites.google.com/view/praghna-learning-centre/4-os-test',
        'definitions': 'https://sites.google.com/view/praghna-learning-centre/definitions-and-terms',
        'subject': 'https://sites.google.com/view/praghna-learning-centre/subject',
        'quiz': 'https://sites.google.com/view/praghna-learning-centre/quiz-yourself'
    };

    // Check for browser support for Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechSynthesis = window.SpeechSynthesis;

    if (!SpeechRecognition || !SpeechSynthesis) {
        aiMessage.textContent = "Your browser does not support the Web Speech API. Please use a modern browser like Chrome.";
        listenButton.style.display = 'none';
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Only get one result at a time
    recognition.lang = 'en-US';

    const synth = window.speechSynthesis;

    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        synth.speak(utterance);
    }

    introButton.addEventListener('click', () => {
        assistantDiv.style.display = 'block';
        const welcomeText = "Hello! Welcome to our research methodology tests. We have tests on Definitions and Terms, how to choose a subject, and how to identify a research issue. Please tell me which test you would like to take.";
        aiMessage.textContent = welcomeText;
        speak(welcomeText);
    });

    listenButton.addEventListener('click', () => {
        aiMessage.textContent = "Listening...";
        recognition.start();
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        aiMessage.textContent = `You said: "${transcript}"`;
        handleUserCommand(transcript);
    };

    recognition.onerror = (event) => {
        aiMessage.textContent = `Error: ${event.error}. Please try again.`;
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

        if (testChosen) {
            const redirectText = `Great! Redirecting you to the test on ${testChosen}.`;
            aiMessage.textContent = redirectText;
            speak(redirectText);
            // Wait for the speech to finish before redirecting
            setTimeout(() => {
                window.location.href = pageUrls[testChosen];
            }, 3000); // 3 seconds delay to let the speech play
        } else {
            const retryText = "I'm sorry, I didn't understand that. Please say the name of the test you'd like to take.";
            aiMessage.textContent = retryText;
            speak(retryText);
        }
    }

});
