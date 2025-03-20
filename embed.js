(function() {
    // Create chatbot stylesheet link
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'https://your-server.com/chatbot.css';
    document.head.appendChild(style);

    // Create chatbot container
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'mof-chatbot-container';
    
    // Load HTML content
    fetch('https://your-server.com/chatbot.php')
        .then(response => response.text())
        .then(html => {
            chatbotContainer.innerHTML = html;
            document.body.appendChild(chatbotContainer);
            
            // Load chatbot script
            const script = document.createElement('script');
            script.src = 'https://your-server.com/chatbot.js';
            document.body.appendChild(script);
        });
})(); 

class Chatbot {
    // Initialize chatbot components and variables
    constructor() {
        // Get all necessary DOM elements
        this.trigger = document.getElementById('chatbot-trigger');        // Chat button
        this.container = document.getElementById('chatbot-container');    // Chat window
        this.closeBtn = document.getElementById('chatbot-close');        // Close button
        this.messages = document.getElementById('chatbot-messages');      // Messages container
        this.input = document.getElementById('chatbot-input-field');     // Input field
        this.sendBtn = document.getElementById('chatbot-send');          // Send button
        this.responses = null;                                           // Will store responses from JSON

        this.init();  // Start initialization
    }
} 