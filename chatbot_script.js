document.addEventListener('DOMContentLoaded', function() {
    // Get references to chatbot input field and message container
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Timer variables for detecting user inactivity
    let typingTimer;
    const doneTypingInterval = 500; // Time in milliseconds before sending message automatically

    // Function to add a message to the chatbot window
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'user-message' : 'bot-message'; // Assign class based on sender
        messageDiv.textContent = message; // Set message text
        chatbotMessages.appendChild(messageDiv); // Append message to the chat container
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Auto-scroll to latest message
    }

    // Function to send a message to the chatbot backend
    async function sendMessage(message) {
        try {
            // Send message to backend API (PHP script)
            const response = await fetch('./backend/chatbot.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }) // Convert message to JSON format
            });

            // Check if the response is valid
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parse response data
            const data = await response.json();
            
            // If response is successful, display the chatbot's reply
            if (data.status === 'success') {
                addMessage(data.message);
            } else {
                addMessage('Sorry, I encountered an error. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('Sorry, I encountered an error. Please try again.');
        }
    }

    // Event listener for when the user presses 'Enter' in the input field
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            const message = this.value.trim(); // Get input value
            addMessage(message, true); // Display user message
            sendMessage(message); // Send message to chatbot
            this.value = ''; // Clear input field
        }
    });

    // Event listener to detect when the user stops typing
    chatbotInput.addEventListener('input', function() {
        clearTimeout(typingTimer); // Clear previous timer
        if (this.value) {
            typingTimer = setTimeout(() => {
                const message = this.value.trim();
                if (message) {
                    addMessage(message, true); // Display user message
                    sendMessage(message); // Send message to chatbot
                    this.value = ''; // Clear input field
                }
            }, doneTypingInterval);
        }
    });

    // Display initial greeting message after page loads
    setTimeout(() => {
        addMessage("Hello! How can I help you today?");
    }, 500);
});
