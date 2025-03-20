class Chatbot {
    constructor() {
        // Get chatbot elements from the DOM
        this.trigger = document.getElementById('chatbot-trigger');
        this.container = document.getElementById('chatbot-container');
        this.closeBtn = document.getElementById('chatbot-close');
        this.messages = document.getElementById('chatbot-messages');
        this.input = document.getElementById('chatbot-input-field');
        this.sendBtn = document.getElementById('chatbot-send');
        this.responses = null;

        // Initialize chatbot
        this.init();
    }

    async init() {
        try {
            // Fetch chatbot responses from a JSON file
            const response = await fetch('./data/chatbot-responses.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.responses = data;
            
            // Setup event listeners after responses are loaded
            this.setupEventListeners();
            
            // Send initial greeting message
            if (this.responses && this.responses.greeting) {
                this.sendBotMessage(this.getRandomResponse('greeting'));
            }
        } catch (error) {
            console.error('Error loading chatbot responses:', error);
            
            // Set default fallback responses in case JSON loading fails
            this.responses = {
                greeting: {
                    responses: ["Hello! How can I help you today?"]
                },
                default: {
                    responses: ["I apologize, but I'm having trouble accessing my responses. Please try again later."]
                }
            };
            
            // Setup event listeners even if default responses are used
            this.setupEventListeners();
            this.sendBotMessage(this.getRandomResponse('greeting'));
        }
    }

    setupEventListeners() {
        // Event listener for opening chatbot
        if (this.trigger) {
            this.trigger.addEventListener('click', () => this.toggleChat());
        }
        
        // Event listener for closing chatbot
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.toggleChat());
        }
        
        // Event listener for sending user message
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.handleUserInput());
        }
        
        // Event listener for pressing 'Enter' key to send message
        if (this.input) {
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleUserInput();
            });
        }
    }

    toggleChat() {
        // Toggle chatbot visibility
        if (this.container) {
            this.container.classList.toggle('active');
            
            // Focus input field when chat opens
            if (this.container.classList.contains('active') && this.input) {
                this.input.focus();
            }
        }
    }

    handleUserInput() {
        if (!this.input) return;
        
        // Get user input text
        const message = this.input.value.trim();
        if (!message) return;

        // Display user message in chat
        this.addMessage(message, 'user');
        this.input.value = '';

        // Generate and display bot response after a short delay
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.sendBotMessage(response);
        }, 500);
    }

    generateResponse(message) {
        if (!this.responses) return this.getRandomResponse('default');

        const lowercaseMessage = message.toLowerCase();
        
        // Check each response category for matching keywords
        for (const [category, data] of Object.entries(this.responses)) {
            if (category === 'default') continue;
            
            // Check if message contains any keyword from the category
            const hasKeyword = data.keywords?.some(keyword => 
                lowercaseMessage.includes(keyword.toLowerCase())
            );
            
            if (hasKeyword) {
                return this.getRandomResponse(category);
            }
        }

        // Return default response if no keywords match
        return this.getRandomResponse('default');
    }

    getRandomResponse(category) {
        // Get a random response from the specified category
        if (!this.responses || !this.responses[category] || !this.responses[category].responses) {
            return "I'm sorry, I'm having trouble processing your request.";
        }
        const responses = this.responses[category].responses;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    sendBotMessage(message) {
        // Display bot message in chat
        this.addMessage(message, 'bot');
    }

    addMessage(message, sender) {
        if (!this.messages) return;

        // Create message div and append to chat
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = message;
        
        this.messages.appendChild(messageDiv);
        this.messages.scrollTop = this.messages.scrollHeight;
    }
}

// Initialize chatbot when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});