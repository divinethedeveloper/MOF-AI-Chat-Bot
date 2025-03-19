document.addEventListener('DOMContentLoaded', function() {
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    let typingTimer;
    const doneTypingInterval = 500;

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'user-message' : 'bot-message';
        messageDiv.textContent = message;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    async function sendMessage(message) {
        try {
            const response = await fetch('./backend/chatbot.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
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

    // Handle input when user presses enter
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            const message = this.value.trim();
            addMessage(message, true);
            sendMessage(message);
            this.value = '';
        }
    });

    // Handle input when user stops typing
    chatbotInput.addEventListener('input', function() {
        clearTimeout(typingTimer);
        if (this.value) {
            typingTimer = setTimeout(() => {
                const message = this.value.trim();
                if (message) {
                    addMessage(message, true);
                    sendMessage(message);
                    this.value = '';
                }
            }, doneTypingInterval);
        }
    });

    // Initial greeting
    setTimeout(() => {
        addMessage("Hello! How can I help you today?");
    }, 500);
}); 