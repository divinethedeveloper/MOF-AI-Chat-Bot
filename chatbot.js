class Chatbot {
    constructor() {
        this.trigger = document.getElementById('chatbot-trigger');
        this.container = document.getElementById('chatbot-container');
        this.closeBtn = document.getElementById('chatbot-close');
        this.messages = document.getElementById('chatbot-messages');
        this.input = document.getElementById('chatbot-input-field');
        this.sendBtn = document.getElementById('chatbot-send');
        this.responses = null;

        this.init();
    }

    async init() {
        try {
            // Load responses from the correct path
            const response = await fetch('./data/chatbot-responses.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.responses = data;
            
            // Setup event listeners only after responses are loaded
            this.setupEventListeners();
            
            // Send initial greeting
            if (this.responses && this.responses.greeting) {
                this.sendBotMessage(this.getRandomResponse('greeting'));
            }
        } catch (error) {
            console.error('Error loading chatbot responses:', error);
            // Set some default responses in case JSON fails to load
            this.responses = {
                greeting: {
                    responses: ["Hello! How can I help you today?"]
                },
                default: {
                    responses: ["I apologize, but I'm having trouble accessing my responses. Please try again later."]
                }
            };
            this.setupEventListeners();
            this.sendBotMessage(this.getRandomResponse('greeting'));
        }
    }

    setupEventListeners() {
        if (this.trigger) {
            this.trigger.addEventListener('click', () => this.toggleChat());
        }
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.toggleChat());
        }
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.handleUserInput());
        }
        if (this.input) {
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleUserInput();
            });
        }
    }

    toggleChat() {
        if (this.container) {
            this.container.classList.toggle('active');
            if (this.container.classList.contains('active') && this.input) {
                this.input.focus();
            }
        }
    }

    handleUserInput() {
        if (!this.input) return;
        
        const message = this.input.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        this.input.value = '';

        // Generate bot response
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.sendBotMessage(response);
        }, 500);
    }

    generateResponse(message) {
        if (!this.responses) return this.getRandomResponse('default');

        const lowercaseMessage = message.toLowerCase();
        
        // Check each category for matching keywords
        for (const [category, data] of Object.entries(this.responses)) {
            if (category === 'default') continue;
            
            const hasKeyword = data.keywords?.some(keyword => 
                lowercaseMessage.includes(keyword.toLowerCase())
            );
            
            if (hasKeyword) {
                return this.getRandomResponse(category);
            }
        }

        // If no keywords match, return default response
        return this.getRandomResponse('default');
    }

    getRandomResponse(category) {
        if (!this.responses || !this.responses[category] || !this.responses[category].responses) {
            return "I'm sorry, I'm having trouble processing your request.";
        }
        const responses = this.responses[category].responses;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    sendBotMessage(message) {
        this.addMessage(message, 'bot');
    }

    addMessage(message, sender) {
        if (!this.messages) return;

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = message;
        
        this.messages.appendChild(messageDiv);
        this.messages.scrollTop = this.messages.scrollHeight;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
}); 